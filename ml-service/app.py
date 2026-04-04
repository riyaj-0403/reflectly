"""
Reflectly ML Microservice
Loads RoBERTa-based emotion model once at startup, serves predictions via HTTP.
Model is kept in memory — no reloading per request.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn.functional as F
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
import logging
import joblib

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Reflectly Emotion ML Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── CONFIG ────────────────────────────────────────────────────────────────────
MODEL_DIR = os.environ.get("MODEL_DIR", "./emotion_model_final")
MAX_LEN = 128
CONFIDENCE_THRESHOLD = 0.6

# Maps model raw labels → UI labels used in the frontend
# These cover every possible output of our 6-class model: anger, fear, joy, love, sadness, surprise
EMOTION_TO_UI: dict[str, str] = {
    "joy":        "Happy",
    "happiness":  "Happy",
    "love":       "Love",
    "sadness":    "Sad",
    "sad":        "Sad",
    "fear":       "Anxious",
    "anxiety":    "Anxious",
    "anger":      "Angry",
    "angry":      "Angry",
    "disgust":    "Angry",
    "surprise":   "Surprise",
    "excitement": "Surprise",
    "neutral":    "Calm",
    "calm":       "Calm",
}

# ─── GLOBAL STATE (loaded once, lives in memory) ───────────────────────────────
tokenizer = None
model = None
label_mapping: dict[int, str] = {}  # idx → raw emotion string
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def _build_label_mapping() -> dict[int, str]:
    """
    Determine the best label mapping in order of priority:
      1. label_encoder.pkl saved alongside the model (most accurate)
      2. model.config.id2label if set
      3. Hardcoded fallback matching the training script
    """
    # Priority 1: label_encoder.pkl from training
    pkl_path = os.path.join(MODEL_DIR, "label_encoder.pkl")
    if os.path.exists(pkl_path):
        try:
            le = joblib.load(pkl_path)
            mapping = {i: cls.lower() for i, cls in enumerate(le.classes_)}
            logger.info(f"[Labels] From label_encoder.pkl: {mapping}")
            return mapping
        except Exception as exc:
            logger.warning(f"[Labels] Failed to load label_encoder.pkl: {exc}")

    # Priority 2: model config id2label
    if model is not None:
        cfg_map = getattr(model.config, "id2label", None)
        if cfg_map:
            mapping = {int(k): v.lower() for k, v in cfg_map.items()}
            logger.info(f"[Labels] From model config: {mapping}")
            return mapping

    # Priority 3: hardcoded from training script
    # sklearn LabelEncoder sorts classes alphabetically, so the 6-class model outputs:
    # 0=anger, 1=fear, 2=joy, 3=love, 4=sadness, 5=surprise
    fallback = {0: 'anger', 1: 'fear', 2: 'joy', 3: 'love', 4: 'sadness', 5: 'surprise'}
    logger.warning(f"[Labels] Using hardcoded fallback: {fallback}")
    return fallback


@app.on_event("startup")
def load_model():
    global tokenizer, model, label_mapping
    if not os.path.exists(MODEL_DIR):
        raise RuntimeError(
            f"Model directory '{MODEL_DIR}' not found. "
            "Place your model files in ml-service/emotion_model_final/"
        )
    try:
        logger.info(f"Loading tokenizer from {MODEL_DIR} ...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)

        logger.info(f"Loading model from {MODEL_DIR} ...")
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
        model.to(device)
        model.eval()

        label_mapping = _build_label_mapping()
        logger.info(f"✅ Model ready on {device} | num_labels={len(label_mapping)}")
    except Exception as exc:
        logger.error(f"❌ Model failed to load: {exc}")
        raise RuntimeError(str(exc))


# ─── SCHEMAS ───────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    text: str


class EmotionResult(BaseModel):
    emotion: str       # UI label  e.g. "Happy"
    raw_emotion: str   # Model label e.g. "joy"
    confidence: float
    top3: list
    uncertainty: str   # "low" | "moderate" | "high"


# ─── ENDPOINTS ─────────────────────────────────────────────────────────────────

@app.post("/predict", response_model=EmotionResult)
@app.post("/analyze", response_model=EmotionResult)   # backward-compat alias
def predict_emotion(req: PredictRequest):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text field cannot be empty")

    try:
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LEN,
            padding=True,
        ).to(device)

        with torch.no_grad():
            logits = model(**inputs).logits
            probs = F.softmax(logits, dim=1)

        probs_np = probs.detach().cpu().numpy()[0]
        pred_index = int(np.argmax(probs_np))
        confidence = float(np.max(probs_np))

        raw_emotion = label_mapping.get(pred_index, "neutral")
        ui_emotion = EMOTION_TO_UI.get(raw_emotion, "Calm")

        # Top-3 predictions
        top3_idx = probs_np.argsort()[-3:][::-1]
        top3 = [
            {
                "emotion": EMOTION_TO_UI.get(label_mapping.get(int(i), "neutral"), "Calm"),
                "raw": label_mapping.get(int(i), "neutral"),
                "confidence": round(float(probs_np[i]), 4),
            }
            for i in top3_idx
        ]

        # Uncertainty level
        if confidence >= 0.80:
            uncertainty = "low"
        elif confidence >= 0.60:
            uncertainty = "moderate"
        else:
            uncertainty = "high"

        logger.info(
            f"[Predict] '{text[:60]}...' → {raw_emotion} ({ui_emotion}) "
            f"conf={confidence:.3f} uncertainty={uncertainty}"
        )

        return EmotionResult(
            emotion=ui_emotion,
            raw_emotion=raw_emotion,
            confidence=round(confidence, 4),
            top3=top3,
            uncertainty=uncertainty,
        )

    except Exception as exc:
        logger.error(f"[Predict] Inference error: {exc}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(exc)}")


@app.get("/health")
def health_check():
    return {
        "status": "ok" if model is not None else "loading",
        "model_loaded": model is not None,
        "device": str(device),
        "num_labels": len(label_mapping),
        "labels": label_mapping,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)

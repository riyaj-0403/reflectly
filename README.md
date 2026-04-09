<div align="center">

# Reflectly

**Emotion-aware journaling, powered by calibrated deep learning.**

*Write freely. Understand yourself better.*

</div>

---

## Overview

Reflectly is a full-stack journaling application that understands the emotional tone of your writing. It combines a fine-tuned RoBERTa model with uncertainty estimation and lexicon-based fusion to classify emotions in journal entries across six categories, then surfaces those insights through mood tracking and visual analytics.

The goal is not to label your feelings, but to help you notice patterns over time, gently and accurately.

---

## Features

- **Emotion Classification** - Fine-tuned RoBERTa model across 6 emotion classes
- **Calibrated Confidence** - Temperature scaling ensures probability outputs are meaningful
- **Uncertainty Estimation** - MSP and entropy signals flag low-confidence predictions
- **Hybrid Fusion** - NRCLex lexicon enriches model predictions conditionally
- **Mood Journey** - Visual timeline of emotional states across entries
- **Insights Dashboard** - Aggregated trends and emotion distribution over time
- **Secure Journaling** - Private entries with user authentication via JWT
- **Responsive UI** - Clean React interface built for reflection, not distraction

---

## Application Preview

### Landing Page
![Landing Page](./assets/landing.jpeg)


### Journal Entry
![Journal Entry](./assets/journal.jpeg)

### Mood Journey
![Mood Journey](./assets/Moodjourney.jpeg)

---

## System Architecture

![System Architecture]

The system separates concerns across three layers:

- **Frontend** - React SPA handles journaling, mood visualization, and user interaction
- **Backend** - Node.js + Express manages auth, user data, and journal persistence via MongoDB
- **ML Service** - FastAPI microservice runs inference, calibration, and uncertainty logic independently

The backend proxies ML requests, keeping the inference service decoupled and independently scalable.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React, Recharts | UI, mood visualizations |
| Backend | Node.js, Express | REST API, business logic |
| Database | MongoDB, Mongoose | User data, journal storage |
| Auth | JWT, bcrypt | Secure session management |
| ML Service | FastAPI, Uvicorn | Inference microservice |
| Model | RoBERTa (HuggingFace) | Emotion classification |
| Calibration | Temperature Scaling | Post-hoc probability calibration |
| Lexicon | NRCLex | Emotion-word hybrid fusion |
| ML Libraries | PyTorch, Transformers, scikit-learn | Model training and evaluation |

---

## Model Details

| Component | Detail |
|---|---|
| Base Model | `roberta-base` (HuggingFace) |
| Task | Multi-class emotion classification |
| Classes | Joy, Sadness, Anger, Fear, Surprise, Disgust |
| Calibration | Temperature scaling (post-hoc) |
| Uncertainty | Maximum Softmax Probability (MSP) + Entropy |
| Fusion | Conditional NRCLex integration on low-confidence inputs |
| Serving | FastAPI + Uvicorn |
| Input | Raw journal text (tokenized, max 512 tokens) |

---

## How It Works

**1. Entry Submission**
The user writes a journal entry in the React frontend. On save, the text is sent to the Node.js backend.

**2. ML Inference**
The backend forwards the text to the FastAPI ML service. RoBERTa tokenizes and encodes the input, producing raw logits across 6 emotion classes.

**3. Calibration**
Temperature scaling is applied to the logits before softmax, correcting overconfidence that is common in fine-tuned transformers.

**4. Uncertainty Estimation**
Two uncertainty signals are computed:
- **MSP (Maximum Softmax Probability)** - Low peak probability indicates uncertainty
- **Entropy** - High entropy across the distribution signals ambiguity

**5. Hybrid Fusion**
If uncertainty exceeds a threshold, NRCLex lexicon scores are blended into the prediction. This grounds ambiguous model outputs in word-level emotion signals.

**6. Storage and Display**
The final emotion label and confidence are stored with the journal entry. The frontend renders the result inline and updates the mood journey and insights views.

---

## Project Structure

```
reflectly/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Journal, Insights, Mood Journey
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/              # API calls, helpers
│   └── public/
│
├── server/                     # Node.js backend
│   ├── routes/                 # Auth, journal, user routes
│   ├── models/                 # Mongoose schemas
│   ├── middleware/              # JWT auth, error handling
│   └── controllers/            # Route logic
│
├── ml-service/                 # FastAPI ML microservice
│   ├── main.py                 # FastAPI app and routes
│   ├── model/
│   │   ├── classifier.py       # RoBERTa inference logic
│   │   ├── calibration.py      # Temperature scaling
│   │   ├── uncertainty.py      # MSP + entropy estimation
│   │   └── fusion.py           # NRCLex hybrid fusion
│   ├── weights/                # Saved model checkpoints
│   └── requirements.txt
│
├── assets/                     # README images
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- Python >= 3.9
- MongoDB (local or Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/reflectly.git
cd reflectly
```

### 2. ML Service

```bash
cd ml-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Place your trained model weights in `ml-service/weights/`.

### 3. Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
```

```bash
npm run dev
```

### 4. Frontend

```bash
cd client
npm install
```

Create a `.env` file in `/client`:

```env
REACT_APP_API_URL=http://localhost:5000
```

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Contributing

Contributions are welcome. If you have ideas for improving the model, the UI, or the architecture, feel free to open an issue or a pull request.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "add: your feature description"
git push origin feature/your-feature-name
```

Please keep PRs focused and include a clear description of what changed and why.

---

## Why This Project

Most journaling tools treat entries as plain text. Reflectly treats them as signals.

The motivation was to explore whether NLP-based emotion understanding could be made genuinely useful in a personal context, not just as a demo, but as a real tool that handles ambiguity honestly. The uncertainty estimation and hybrid fusion pipeline exist precisely because no model is always right. When the model is unsure, it says so, and falls back on a complementary signal instead of guessing confidently.

Mental health tooling deserves the same engineering rigor as any other production system.

---

<div align="center">

*Built with care. Designed for reflection.*

</div>

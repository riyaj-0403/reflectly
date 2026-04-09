
🌸 Reflectly – AI-Powered Emotion-Aware Journaling
<p align="center"> <img src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" width="250"/> </p>

“Write your thoughts. Understand your emotions. Grow a little every day.” 🌿

💭 Overview

Reflectly is an AI-powered journaling application that helps users understand their emotions through text.
Instead of just storing thoughts, it analyzes emotional patterns, provides feedback, and makes journaling more meaningful and self-aware.

This project combines:

🤖 Deep Learning (RoBERTa)
📊 Uncertainty-aware predictions
🧠 Hybrid emotion reasoning (NRCLex)
🌐 Full-stack deployment
✨ Features

🌸 Emotion Detection from journal entries
🌿 Confidence-aware predictions (no blind guessing)
📊 Mood tracking over time
🔥 Streak tracking for consistency
🧠 Hybrid AI + lexicon reasoning
⚡ Real-time predictions using FastAPI
💾 MongoDB-based storage

🧠 How It Works
<p align="center"> <img src="https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif" width="300"/> </p>
User writes a journal entry ✍️
Text is sent to backend
Model predicts emotion using RoBERTa
Confidence is calibrated (temperature scaling)
Uncertainty is analyzed
If confidence is low → NRCLex fusion applied
Final emotion is returned
🏗️ Tech Stack
🔹 Frontend
React.js
🔹 Backend
Node.js + Express
MongoDB
🔹 ML Inference
FastAPI
HuggingFace Transformers
PyTorch
⚙️ Model Details
Model: RoBERTa-base
Classes: anger, fear, joy, love, sadness, surprise
F1 Score: 0.9560
Calibration: Temperature Scaling
ECE Reduced: 0.0342 → 0.0145
🔍 Key Concepts Used

🌱 Calibration (Temperature Scaling)
Improves reliability of predictions

🌼 Uncertainty Estimation
MSP (confidence)
Entropy (ambiguity)

🌸 Hybrid Fusion (NRCLex)
Used when model is unsure

📊 System Architecture
<p align="center"> <img src="your_system_architecture.png" width="700"/> </p>
📸 UI Preview
<p align="center"> <img src="your_ui_screenshot.png" width="500"/> </p>
🚀 Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/reflectly.git
cd reflectly
2. Backend setup
cd backend
npm install
npm start
3. ML Service
cd ml-service
pip install -r requirements.txt
uvicorn app:app --reload
4. Frontend
cd frontend
npm install
npm start
📁 Project Structure
Reflectly/
│
├── frontend/        # React UI
├── backend/         # Node.js server
├── ml-service/      # FastAPI + model
├── models/          # Saved model + tokenizer
└── notebooks/       # Training + experiments
🌷 Why This Project Matters

Mental health tools often:
❌ ignore uncertainty
❌ give overconfident outputs

Reflectly solves this by:
✅ showing reliable predictions
✅ handling ambiguity
✅ combining AI with human-like reasoning
🌼 Future Improvements
Multi-label emotion detection
Personal emotion trends
Better recommendation system
Mobile app version 📱
🤍 A Small Note
<p align="center"> <img src="https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif" width="250"/> </p>

Take care of your mind the same way you take care of everything else.
Even writing one line a day matters 🌿

⭐ If you like this project

Give it a star ⭐
It helps more than you think!

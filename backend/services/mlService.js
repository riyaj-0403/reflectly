const axios = require('axios');

// 🔥 Change this if your Python ML server runs on a different port
const ML_API_URL = 'http://127.0.0.1:8000/predict';

/**
 * Calls the ML model API and returns normalized output
 * IMPORTANT: This service ONLY returns rawEmotion (no UI mapping)
 */
const analyzeEmotion = async (text) => {
  try {
    const response = await axios.post(ML_API_URL, {
      text,
    });

    const data = response.data;

    // 🔍 Debug log (optional)
    console.log('ML RAW RESPONSE:', data);

    return {
      // ✅ Always return rawEmotion ONLY
      rawEmotion:
        data.raw_emotion ||   // preferred key from Python
        data.emotion ||       // fallback if API uses this
        'sadness',            // safe fallback (valid class)

      confidence:
        typeof data.confidence === 'number'
          ? data.confidence
          : 0,

      top3:
        Array.isArray(data.top3)
          ? data.top3
          : [],
    };
  } catch (error) {
    console.error('ML Service Error:', error.message);

    // 🔥 Safe fallback (NO "Calm", NO "neutral")
    return {
      rawEmotion: 'sadness',
      confidence: 0,
      top3: [],
    };
  }
};

module.exports = {
  analyzeEmotion,
};
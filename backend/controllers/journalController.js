const JournalEntry = require('../models/JournalEntry');
const { analyzeEmotion } = require('../services/mlService');

// 🔥 MODEL → UI EMOTION MAPPING
const modelToUIEmotionMap = {
  anger: 'Angry',
  fear: 'Anxious',
  joy: 'Happy',
  love: 'Love',
  sadness: 'Sad',
  surprise: 'Surprise',
};

// 🧠 Calm keywords (for smart detection)
const calmKeywords = [
  'calm',
  'peaceful',
  'relaxed',
  'chill',
  'fine',
  'okay',
  'ok',
  'content',
  'at ease',
];

// POST /api/journal
exports.createEntry = async (req, res) => {
  try {
    const { text, tags } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: 'Journal text is required' });
    }

    let emotionData;

    try {
      emotionData = await analyzeEmotion(text.trim());
    } catch (mlErr) {
      console.error('[journal/create] ML error:', mlErr.message);

      // ✅ Safe fallback
      emotionData = {
        rawEmotion: 'sadness',
        confidence: 0,
        top3: [],
      };
    }

    const rawEmotion = emotionData.rawEmotion;
    const confidence = emotionData.confidence;
    const textInput = text.toLowerCase();

    // 🔥 Base mapping
    let mappedEmotion = modelToUIEmotionMap[rawEmotion];

    // 🧠 SMART CALM DETECTION
    if (
      rawEmotion === 'sadness' &&
      confidence < 0.6 &&
      calmKeywords.some((word) => textInput.includes(word))
    ) {
      mappedEmotion = 'Calm';
    }

    // fallback safety
    if (!mappedEmotion) {
      console.warn('Unknown emotion:', rawEmotion);
      mappedEmotion = 'Sad';
    }

    // 🔥 Save to DB
    const entry = await JournalEntry.create({
      userId: req.user.id,
      text: text.trim(),
      emotion: mappedEmotion,
      rawEmotion: rawEmotion,
      confidence: confidence,
      tags: tags || [],
    });

    // 🔍 Debug log
    console.log({
      input: text,
      raw: rawEmotion,
      mapped: mappedEmotion,
      confidence,
    });

    res.status(201).json({
      entry,
      emotion: mappedEmotion,
      rawEmotion,
      confidence,
      top3: emotionData.top3,
    });

  } catch (err) {
    console.error('[journal/create]', err.message);
    res.status(500).json({ msg: 'Failed to save journal entry' });
  }
};

// GET /api/journal
exports.getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(entries);
  } catch (err) {
    console.error('[journal/list]', err.message);
    res.status(500).json({ msg: 'Failed to fetch entries' });
  }
};

// GET /api/journal/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const entries = await JournalEntry.find({
      userId: req.user.id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ createdAt: 1 });

    const moodData = {};
    const moodCounts = {};

    entries.forEach((entry) => {
      const day = new Date(entry.createdAt).getDate();
      moodData[day] = entry.emotion;
      moodCounts[entry.emotion] = (moodCounts[entry.emotion] || 0) + 1;
    });

    const total = entries.length || 1;

    const weeklyStats = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // 🔥 Streak calculation
    const entriesByDay = new Set(
      entries.map((e) => new Date(e.createdAt).toDateString())
    );

    let streak = 0;
    const check = new Date();

    while (entriesByDay.has(check.toDateString())) {
      streak++;
      check.setDate(check.getDate() - 1);
    }

    res.json({ moodData, weeklyStats, streak });

  } catch (err) {
    console.error('[journal/dashboard]', err.message);
    res.status(500).json({ msg: 'Failed to fetch dashboard data' });
  }
};

// POST /api/journal/analyze (preview only)
exports.analyzeOnly = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: 'text is required' });
    }

    const result = await analyzeEmotion(text.trim());

    const mappedEmotion =
      modelToUIEmotionMap[result.rawEmotion] || 'Sad';

    res.json({
      ...result,
      emotion: mappedEmotion,
    });

  } catch (err) {
    console.error('[journal/analyze]', err.message);
    res.status(503).json({ msg: err.message });
  }
};
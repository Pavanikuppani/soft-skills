# 🎙️ InterviewAI — AI-Powered Interview Coach

Full-stack application that analyzes interview responses and provides actionable feedback using Groq LLaMA3.

---

## 🗂️ Project Structure

```
interview-coach/
├── backend/
│   ├── server.js                 ← Express app entry point
│   ├── package.json
│   ├── .env.example              ← Copy to .env and fill in values
│   ├── routes/
│   │   ├── analysis.js           ← POST /api/analysis/submit & /retry
│   │   ├── sessions.js           ← GET/DELETE session history
│   │   └── users.js              ← User creation
│   ├── models/
│   │   ├── Session.js            ← MongoDB session + attempts schema
│   │   └── User.js               ← User profile schema
│   ├── middleware/
│   │   └── validate.js           ← Joi request validation
│   └── utils/
│       ├── prompt.js             ← AI prompt builder (4 modes)
│       └── groqClient.js         ← Groq API wrapper
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js              ← React entry point
        ├── App.jsx               ← Root with routing + Toaster
        ├── styles/
        │   └── globals.css       ← Design system (CSS vars, animations)
        ├── utils/
        │   ├── api.js            ← Axios client + API methods
        │   └── storage.js        ← LocalStorage + Skill Memory
        ├── hooks/
        │   ├── useAnalysis.js    ← Submit + retry + state management
        │   └── useSpeechToText.js← Web Speech API integration
        ├── components/
        │   ├── Header.jsx        ← Sticky nav with weak area badge
        │   ├── ModeSelector.jsx  ← HR / Technical / Group / Casual
        │   ├── ResponseInput.jsx ← Textarea + mic button
        │   ├── FeedbackCard.jsx  ← Full feedback UI
        │   ├── ScoreBar.jsx      ← Animated score bars
        │   └── ScoreRadar.jsx    ← Recharts radar chart
        └── pages/
            ├── PracticePage.jsx  ← Main practice flow
            ├── ProgressPage.jsx  ← Score trend + stats
            └── HistoryPage.jsx   ← Session history log
```

---

## 🚀 Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in GROQ_API_KEY in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

App opens at http://localhost:3000

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Get from console.groq.com |
| `MONGODB_URI` | ❌ Optional | Falls back to in-memory if not set |
| `PORT` | ❌ Optional | Default: 5000 |
| `FRONTEND_URL` | ❌ Optional | Default: http://localhost:3000 |

---

## 🎯 Features

- **4 Interview Modes**: HR, Technical, Group Discussion, Casual
- **Voice Input**: Web Speech API microphone support
- **AI Feedback**: Groq LLaMA3 analyzes 5 dimensions + filler words
- **Retry Loop**: Submit again + see score improvement delta
- **Skill Memory**: Tracks weak areas across sessions (localStorage)
- **Progress Charts**: Score trend via Recharts
- **Graceful Fallback**: Works without MongoDB (in-memory sessions)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analysis/submit` | Analyze a new response |
| POST | `/api/analysis/retry` | Retry same question |
| GET | `/api/analysis/questions?mode=hr` | Sample questions |
| GET | `/api/sessions/:userId` | User's session history |
| GET | `/api/sessions/stats/:userId` | Aggregate stats |
| POST | `/api/users/create` | Create user profile |
| GET | `/api/health` | Health check |
=======
# soft-skills
An interactive soft skills training platform that helps students improve communication, confidence, interview skills, and overall personality through practice and feedback.
>>>>>>> 283fc03e7880209fc9dc468b65859a1c7351c0ab

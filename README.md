# ⚔ AUTO-WARGAME — Malaysia Policy Simulation Engine
### Powered by Z.AI ILMU-GLM-5.1

---

## 📁 Project Structure

```
auto-wargame/
├── backend/
│   ├── server.js        ← Express API server
│   ├── .env             ← ⭐ PASTE YOUR API KEY HERE
│   └── package.json
└── frontend/
    └── public/
        └── index.html   ← Open this in browser
```

---

## 🔑 WHERE TO PASTE YOUR API KEY

Open this file in VS Code:
```
backend/.env
```

Replace `PASTE_YOUR_KEY_HERE` with your actual key:
```
ILMU_API_KEY=sk-your-actual-key-goes-here
```

Get your key from: https://console.ilmu.ai/dashboard → API Keys

---

## 🚀 How to Run

### Step 1 — Install backend dependencies
Open VS Code Terminal (Ctrl+` ) and run:
```bash
cd backend
npm install
```

### Step 2 — Start the backend server
```bash
npm start
```
You should see:
```
✅ Auto-Wargame backend running on http://localhost:3001
   API Key: ✓ Configured
   Model:   ILMU-GLM-5.1
```

### Step 3 — Open the frontend
In VS Code, right-click `frontend/public/index.html` → **Open with Live Server**

OR just open the file directly in your browser:
- Windows: double-click `index.html`
- Mac: `open frontend/public/index.html`

---

## ✅ Verify It Works

1. The top-right status pill should turn green: **BACKEND + KEY OK**
2. Select a preset scenario (e.g. RON95 Subsidy Removal)
3. Click **LAUNCH SIMULATION**
4. Watch the 6-stage workflow run live

---

## 🛠 Troubleshooting

| Problem | Fix |
|---|---|
| `BACKEND OFFLINE` | Run `npm start` in the backend folder |
| `KEY MISSING` | Edit `backend/.env`, add your ILMU key, restart server |
| `API 401 Unauthorized` | Key is wrong — copy it again from console.ilmu.ai |
| `API 400 Bad Request` | Model name may differ — check docs.ilmu.ai for exact model key |
| Port 3001 in use | Change `PORT=3002` in `.env` and reload |

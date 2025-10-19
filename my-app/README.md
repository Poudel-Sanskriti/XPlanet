# xPlanit 🚀

**Navigate the Confusing Galaxy of Finance with AI That Actually Explains Things**

AI-powered financial education platform that makes banking transparent and understandable. Built for HackTX 2025.

---

## ✨ Features

- 🚀 **3D Interactive Navigation** - Explore 4 planets (Home, Budget, Investment, Credit) with beautiful Three.js graphics
- 🤖 **AI Financial Advisor** - Chat with Captain Gemini (powered by Google Gemini 2.0) for personalized advice
- 📄 **Document Translator** - Upload financial documents, get plain English explanations with AI
- 🏦 **Multiple Bank Connections** - Auto-sync transactions via Plaid, auto-populate your profile
- 🔊 **Voice Responses** - ElevenLabs text-to-speech for accessibility
- 📊 **Smart Tracking** - Visualize spending, credit score, goals, and investment plans
- ⚡ **2-Minute Onboarding** - Connect your bank and skip manual data entry

---

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, Framer Motion
**3D Graphics:** Three.js, React Three Fiber
**AI & APIs:** Google Gemini 2.0, Plaid API, ElevenLabs API
**Data:** Zustand, Recharts, localStorage

---

## 🚀 Quick Start

1. **Clone and install:**
```bash
git clone https://github.com/Poudel-Sanskriti/xPlanit.git
cd xPlanit/my-app
npm install
```

2. **Create `.env.local`:**
```env
GEMINI_API_KEY=your_gemini_key
PLAID_CLIENT_ID=your_plaid_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
ELEVENLABS_API_KEY=your_elevenlabs_key
```

3. **Run:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Get API Keys

- **Gemini:** [Google AI Studio](https://aistudio.google.com/app/apikey) (free)
- **Plaid:** [Plaid Dashboard](https://dashboard.plaid.com/signup) (free sandbox)
- **ElevenLabs:** [ElevenLabs](https://elevenlabs.io/) (10k chars/month free)

---

## 📁 Structure

```
app/
├── api/           # Gemini, Plaid, Voice, Investment endpoints
├── onboarding/    # 5-step onboarding flow
├── chat/          # AI chat interface
├── planet/[id]/   # Budget, Investment, Credit pages
└── page.tsx       # 3D planetary navigator

components/        # React components (3D models, charts, UI)
lib/              # Gemini, Plaid, userData, AI analysis
```

---

## 💡 How It Works

**Connect your bank** → AI analyzes transactions → Detects income, categorizes spending, extracts debts → Auto-fills your profile → Chat with Captain Gemini for personalized advice

---

## 🙏 Credits

Built with Google Gemini AI, Plaid, and ElevenLabs for HackTX 2025.

**Keep navigating, Navigator! 🚀**

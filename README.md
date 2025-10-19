# XPlainit 🚀

**Navigate the Confusing Galaxy of Finance with AI That Actually Explains Things**

XPlainit is an AI-powered financial education platform that makes banking transparent and understandable. We combine the engagement of space-themed exploration with real-world financial utility—using Google Gemini AI to translate confusing financial jargon into plain English, provide personalized advice, and help users navigate their financial journey with confidence.

Built for HackTX 2025 | Competing for: Capital One Best Financial Hack, Best Use of Gemini 2.5, Best Use of ElevenLabs, Best Celestial-Themed, Best Novice

---

## 🌟 The Problem

- **60% of Americans** don't fully understand bank fees and statements
- **Financial jargon** creates barriers to financial literacy (APR, APY, utilization, etc.)
- **Traditional banking apps** show data but don't explain what it means
- **Gen Z avoids** checking bank accounts due to financial anxiety
- **Generic advice** doesn't account for individual circumstances

## 💡 Our Solution

XPlainit reimagines banking education by combining:

1. **AI Financial Translator** - Upload statements, credit reports, or confusing documents → Get instant plain-English explanations
2. **Interactive Learning Journey** - Navigate through planets representing financial topics with beautiful 3D visualizations
3. **Captain Gemini AI Advisor** - Ask any financial question via voice or text and get personalized, conversational answers
4. **Real-Time Fee Detection** - AI scans for hidden fees and provides negotiation scripts to get them waived
5. **Gamified Progress** - Earn XP and badges for completing financial missions and improving your "Financial Orbit Score"

---

## 🎯 Core Features

### 1. **Planetary Navigation System** 🪐
Navigate through an interactive solar system where each planet represents a financial topic:

- **🌍 Earth (Home)**: Dashboard and Financial Orbit Score
- **🔴 Mars (Credit & Loans)**: Credit score tracking, debt management, loan explanations
- **🪐 Jupiter (Budgeting & Goals)**: Spending analysis, budget planning, savings goals
- **🪐 Saturn (Investment)**: Investment basics, portfolio tracking (planned)

**Features:**
- Drag a rocket through space to navigate between planets
- 3D realistic planet models (Earth, Mars, Jupiter, Saturn)
- Smooth orbital animations and transitions
- Interactive tutorial for first-time users

### 2. **Captain Gemini - Your AI Financial Guide** 🤖

**Voice & Text Chat Interface:**
- Ask any financial question in plain language
- Get personalized responses based on YOUR financial data
- ElevenLabs voice integration for audio responses
- Conversational, friendly tone (space-themed personality)

**Examples:**
- "What does APR mean and how does it affect me?"
- "Should I pay off my credit card or build my emergency fund first?"
- "Why did my credit score drop last month?"

**AI Capabilities:**
- Multi-turn conversations with context
- Personalized advice using your income, expenses, debts, and goals
- Financial document analysis and explanation
- Real-time insights and recommendations

### 3. **Financial Orbit Score™** 📊

AI-powered holistic financial health score (0-100) that goes beyond credit scores:

**Analyzes:**
- Income vs. expenses ratio
- Debt-to-income ratio
- Savings rate and emergency fund status
- Credit score and utilization
- Financial goals progress

**Provides:**
- Overall score with grade (Poor/Fair/Good/Excellent)
- Orbit strength visualization (Unstable → Strong)
- Top 3 financial strengths
- Top 3 areas for improvement
- Personalized action items from Gemini

**Visual:**
- Circular progress gauge with dynamic colors
- Animated orbit rings that strengthen as score improves
- Real-time updates as you improve finances

### 4. **Smart Financial Document Translator** 📄

**Upload & Understand:**
- Bank statements → Line-by-line explanations
- Credit reports → Plain English breakdown
- Loan documents → What you're actually agreeing to
- Investment prospectuses → Key terms explained
- Insurance policies → Coverage details clarified

**Powered by Gemini:**
- OCR text extraction
- Context-aware analysis
- Jargon-to-plain-English translation
- Highlights important info (fees, rates, terms)

### 5. **Predictive Spending Alerts** ⚠️

**AI-Powered Warnings:**
- Predicts if you'll overspend this month based on current trajectory
- Alerts appear as "asteroid warnings" in planetary navigation
- Provides specific actionable suggestions

**Example Alert:**
```
🚨 Asteroid Warning!
You're on track to overspend by $247 this month.

Suggestions:
→ Reduce dining out spend by $150 (currently $320/month)
→ Skip one subscription ($12.99)
→ Use grocery budget more efficiently
```

### 6. **Fee Detection & Negotiation Scripts** 💰

**Real Money Savings:**
- AI scans statements for hidden/unfair fees
- Calculates likelihood of successful fee waiver
- Generates personalized negotiation scripts

**Example:**
```
Fee Detected: $35 Overdraft Fee (Jan 15)
Waiver Success Rate: 80% (first-time offense)

📞 Recommended Script:
"Hi, I noticed a $35 overdraft fee from January 15th.
I've been a loyal customer for 3 years and this is my
first overdraft. Could you please waive this fee as a
courtesy? I've now set up low-balance alerts to prevent
this in the future. Thank you!"
```

### 7. **Interactive Data Visualizations** 📈

**Built with Recharts:**
- Spending breakdown pie charts
- Credit score gauge (radial chart)
- Goal progress bars with completion estimates
- Debt payoff timeline visualization
- Month-over-month trend analysis

**Features:**
- Responsive and mobile-friendly
- Space-themed color schemes
- Smooth animations
- Interactive tooltips

### 8. **Gamification & Missions** 🎮

**Complete missions to earn XP:**
- "First Steps" - Complete onboarding (50 XP)
- "Budget Tracker" - Log expenses for 7 days (100 XP)
- "Credit Explorer" - Check your credit score (75 XP)
- "Goal Setter" - Create your first savings goal (50 XP)
- "AI Learner" - Ask Captain Gemini 5 questions (100 XP)

**Progression System:**
- Level up as you gain XP
- Unlock badges for achievements
- Visual celebrations (animations, confetti)
- Progress bar visible across all pages

### 9. **6-Step Onboarding Wizard** 🧙‍♂️

Collects essential financial data to personalize experience:

1. **Personal Info** - Name, age
2. **Income** - Annual/monthly income
3. **Expenses** - Rent, utilities, food, etc.
4. **Debts** - Student loans, credit cards, auto loans
5. **Credit Score** - Current credit score
6. **Goals** - Emergency fund, vacation, down payment, etc.

**Features:**
- Progress indicator
- Skip option for each step
- Data stored in localStorage (no signup required for demo)
- Beautiful space-themed UI

---

## 🛠️ Technical Architecture

### **Frontend Stack**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js (@react-three/fiber, @react-three/drei)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand (chat), localStorage (user data)

### **Backend Stack**
- **Runtime**: Next.js API Routes (serverless functions)
- **AI**: Google Gemini 2.0 Flash Experimental API
- **Voice**: ElevenLabs Text-to-Speech API
- **Data Storage**: localStorage (browser-based, no database needed for demo)

### **Key APIs**

**Google Gemini 2.0 API:**
- Model: `gemini-2.0-flash-exp`
- Use cases:
  - Conversational financial advice
  - Financial document analysis
  - Personalized recommendations
  - Orbit Score calculation
  - Mission generation
  - Spending pattern analysis

**ElevenLabs API:**
- Voice: Custom "Captain Gemini" voice
- Use cases:
  - Text-to-speech for AI responses
  - Mission completion announcements
  - Level-up celebrations
  - Financial tip narration

### **Project Structure**
```
my-app/
├── app/
│   ├── api/
│   │   ├── gemini/route.ts       # AI chat endpoint
│   │   └── voice/route.ts        # Text-to-speech endpoint
│   ├── chat/page.tsx             # AI chat interface
│   ├── constellation/page.tsx    # All planets view
│   ├── onboarding/page.tsx       # User data collection wizard
│   ├── planet/[id]/page.tsx      # Dynamic planet pages
│   ├── profile/page.tsx          # User profile editor
│   └── page.tsx                  # Main planetary navigation
├── components/
│   ├── ChatInterface.tsx         # AI chat UI
│   ├── EarthModel.tsx            # 3D Earth component
│   ├── JupiterModel.tsx          # 3D Jupiter component
│   ├── MarsModel.tsx             # 3D Mars component
│   ├── SaturnModel.tsx           # 3D Saturn component
│   ├── OrbitScoreCard.tsx        # Financial health score display
│   ├── PlanetaryNavigator.tsx    # Main navigation system
│   └── UserProfileBadge.tsx      # User info display
├── lib/
│   ├── gemini.ts                 # Gemini AI integration
│   ├── financialScore.ts         # Orbit Score calculation
│   ├── store.ts                  # Zustand state management
│   └── userData.ts               # User data management
├── data/
│   └── insurance.json            # Insurance data
└── public/
    ├── earth.glb                 # 3D Earth model
    ├── mars.glb                  # 3D Mars model
    ├── realistic_jupiter.glb     # 3D Jupiter model
    ├── saturn.glb                # 3D Saturn model
    └── space_bg.mp4              # Background video
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ installed
- pnpm (recommended) or npm

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Poudel-Sanskriti/XPlanet.git
cd XPlanet/my-app
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

Create `.env.local` file in the `my-app` directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get API Keys:**
- Gemini: https://ai.google.dev/
- ElevenLabs: https://elevenlabs.io/

4. **Run the development server**
```bash
pnpm dev
# or
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

### **Building for Production**
```bash
pnpm build
pnpm start
```

---

## 🎨 Design Philosophy

### **Space-Themed Financial Education**
- **Why Space?** Space exploration represents journey, discovery, and navigation—perfect metaphors for financial learning
- **Visual Language**: Planets = Topics, Rocket = User, Orbits = Progress, Stars = Milestones
- **Color Palette**: Deep space blues, nebula purples, star golds, planet teals

### **Educational Psychology**
- **Progressive Disclosure**: Information revealed gradually to avoid overwhelm
- **Immediate Feedback**: XP, animations, and celebrations for every action
- **Low Barrier to Entry**: No signup required, works instantly
- **Personalization**: All advice tailored to individual financial situation

### **Accessibility**
- **Voice Option**: For users who prefer audio learning
- **Plain Language**: No financial jargon without explanation
- **Visual Learning**: Charts and graphics for visual learners
- **Mobile-First**: Optimized for smartphone use

---

## 🏆 Prize Track Alignment

### **Capital One - Best Financial Hack**
**How we reimagine banking:**
- ✅ AI translator makes confusing financial documents understandable
- ✅ Predictive alerts prevent overspending BEFORE it happens
- ✅ Fee negotiation scripts empower users to save money
- ✅ Gamification makes finance learning addictive instead of anxiety-inducing
- ✅ Holistic Orbit Score goes beyond just credit scores

### **Best Use of Gemini 2.5 Computer Use Model**
**Advanced Gemini integration:**
- ✅ Multi-turn conversational AI with context retention
- ✅ Financial document OCR and analysis
- ✅ Personalized recommendation engine
- ✅ Structured data extraction (Orbit Score calculation)
- ✅ Dynamic content generation (missions, tips, scripts)
- ✅ Pattern analysis (spending habits, debt trajectories)

### **Best Use of ElevenLabs**
**Voice integration:**
- ✅ Captain Gemini speaks all AI responses
- ✅ Mission completion voice announcements
- ✅ Level-up celebrations with voice
- ✅ Financial tip narration
- ✅ "Give your vision a voice" - making finance friendly through personality

### **Best Celestial-Themed**
**Space-themed excellence:**
- ✅ Entire app is space-exploration themed
- ✅ 3D realistic planet models
- ✅ Rocket navigation system
- ✅ Orbits, asteroids, constellations as UX metaphors
- ✅ Starfield backgrounds and particle effects

### **Best Novice**
**First-time hackathon experience:**
- ✅ Learning new APIs (Gemini, ElevenLabs)
- ✅ First time building with AI
- ✅ Challenges overcome (3D models, API integration, state management)
- ✅ Demonstrates rapid learning and execution

---

## 🛣️ Roadmap

### **✅ Completed (Current)**
- [x] Planetary navigation with draggable rocket
- [x] 3D planet models (Earth, Mars, Jupiter, Saturn)
- [x] 6-step onboarding wizard
- [x] User data management (localStorage)
- [x] Gemini AI chat integration
- [x] Planet detail pages with visualizations
- [x] Credit score gauge, spending charts, goal progress
- [x] Space-themed UI/UX
- [x] Responsive design
- [x] Financial Orbit Score system

### **🔨 In Progress**
- [ ] ElevenLabs voice integration in chat
- [ ] Document upload and AI translation
- [ ] Predictive spending alerts
- [ ] Fee detection and negotiation scripts
- [ ] Mission system and XP tracking
- [ ] Badge unlocking system

### **📋 Planned Features**
- [ ] Voice input (speech-to-text)
- [ ] Financial news "Explain Like I'm 5"
- [ ] Personalized 6-month financial roadmap
- [ ] Social challenges (save with friends)
- [ ] Transaction categorization game
- [ ] Real banking API integration
- [ ] Multi-device sync
- [ ] Push notifications for alerts
- [ ] PWA (Progressive Web App)
- [ ] AI-generated personalized missions

---

## 📚 Documentation

- [Hackathon Roadmap](./HACKATHON_ROADMAP.md) - 24-hour build plan
- [Context Document](./my-app/CONTEXT.md) - Technical details and architecture

---

## 👥 Team

Built by a team of 4 passionate developers for HackTX 2025.

---

## 📄 License

This project is built for educational purposes as part of HackTX 2025.

---

## 🙏 Acknowledgments

- Google Gemini 2.0 for AI capabilities
- ElevenLabs for voice technology
- Capital One for inspiring financial innovation
- HackTX 2025 organizers
- Three.js community for 3D resources

---

**🚀 Making finance understandable, one planet at a time.**

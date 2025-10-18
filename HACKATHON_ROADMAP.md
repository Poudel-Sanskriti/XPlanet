# XPlanet - 24-Hour Hackathon Roadmap
**HackTX 2025 | Team of 4 | Complete Build Guide**

---

## 📊 TIMELINE OVERVIEW
- **Hours 0-6:** Milestones 1-3 (Setup & Foundation)
- **Hours 6-12:** Milestones 4-6 (Core Features)
- **Hours 12-18:** Milestones 7-8 (Advanced Features)
- **Hours 18-22:** Milestone 9 (Polish & Deploy)
- **Hours 22-24:** Milestone 10 (Demo & Submission)

---

## 🎯 MILESTONE 1: Environment Setup & Project Initialization
**Duration:** 45-60 minutes | **Hours 0-1**
**Owner:** Everyone (Team synchronization)

### Steps:
1. **Clone the repository locally** ✅ DONE
   ```bash
   git clone https://github.com/Poudel-Sanskriti/XPlanet.git
   cd XPlanet
   ```

2. **Install pnpm globally** (if not installed)
   ```bash
   npm install -g pnpm
   ```

3. **Verify Node.js version** (need v18+)
   ```bash
   node --version
   ```

4. **Create Next.js project with TypeScript**
   ```bash
   pnpm create next-app@latest . --typescript --tailwind --app --no-src
   ```
   - Select: TypeScript ✅, ESLint ✅, Tailwind ✅, App Router ✅, No src/ directory

5. **Install core dependencies**
   ```bash
   pnpm add @google/generative-ai framer-motion lucide-react zustand recharts howler
   ```

6. **Install dev dependencies**
   ```bash
   pnpm add -D @types/howler
   ```

7. **Create `.env.local` file**
   ```bash
   touch .env.local
   ```

8. **Add environment variables** (use placeholders for now)
   ```
   GEMINI_API_KEY=your_key_here
   ELEVENLABS_API_KEY=your_key_here
   ELEVENLABS_VOICE_ID=your_voice_id_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

9. **Update `.gitignore`** to include:
   ```
   .env.local
   .env*.local
   ```

10. **Create project folder structure**
    ```bash
    mkdir -p app/api/gemini app/api/voice app/chat app/planet/\[id\]
    mkdir -p components lib data public/audio public/images
    ```

11. **Test Next.js runs**
    ```bash
    pnpm dev
    ```
    Open http://localhost:3000 - should see default Next.js page

12. **Create initial README update**
    - Document setup steps
    - Add "Getting Started" section
    - List environment variables needed

13. **Commit initial setup**
    ```bash
    git add .
    git commit -m "Initial Next.js setup with dependencies"
    git push origin main
    ```

14. **Have all team members pull the repo**
    ```bash
    git pull origin main
    pnpm install
    ```

15. **Verify everyone can run `pnpm dev` successfully**
    - Check in group chat
    - Troubleshoot any issues now

✅ **Milestone 1 Complete:** Everyone has working Next.js app locally

---

## 🎯 MILESTONE 2: API Keys & Basic Configuration
**Duration:** 30-45 minutes | **Hours 1-1.5**
**Owner:** AI Architect + Project Manager

### Steps:
1. **Sign up for Google AI Studio**
   - Go to https://ai.google.dev/
   - Create free account
   - Navigate to "Get API Key"

2. **Generate Gemini API key**
   - Click "Create API Key"
   - Copy key immediately
   - Store securely

3. **Add Gemini key to `.env.local`**
   ```
   GEMINI_API_KEY=actual_key_here
   ```

4. **Sign up for ElevenLabs**
   - Go to https://elevenlabs.io/
   - Create free account
   - Navigate to Profile → API Keys

5. **Generate ElevenLabs API key**
   - Copy API key
   - Store securely

6. **Find ElevenLabs Voice ID**
   - Go to VoiceLab or use pre-made voices
   - Recommended: "Adam" or "Antoni" for Captain Gemini
   - Copy Voice ID (found in URL or voice settings)

7. **Add ElevenLabs credentials to `.env.local`**
   ```
   ELEVENLABS_API_KEY=actual_key_here
   ELEVENLABS_VOICE_ID=actual_voice_id_here
   ```

8. **Create `lib/config.ts` for environment validation**
   ```typescript
   export const config = {
     geminiKey: process.env.GEMINI_API_KEY,
     elevenLabsKey: process.env.ELEVENLABS_API_KEY,
     elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID,
     appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
   };
   ```

9. **Test Gemini API with simple script** (create `scripts/test-gemini.ts`)
   - Make a simple API call
   - Verify it returns a response

10. **Test ElevenLabs API with simple script** (create `scripts/test-elevenlabs.ts`)
    - Generate "Hello Navigator" audio
    - Verify audio file is created

11. **Document API limits in shared doc**
    - Gemini: 15 req/min, 1,500/day
    - ElevenLabs: 10,000 chars/month

12. **Share API keys securely with team**
    - Use encrypted method (1Password, LastPass, etc.)
    - Or DM individually (not in public chat)

13. **Have each team member add keys to their local `.env.local`**

14. **Verify no `.env.local` files are committed**
    ```bash
    git status  # Should not show .env.local
    ```

15. **Create `.env.example` for reference**
    ```
    GEMINI_API_KEY=your_gemini_key
    ELEVENLABS_API_KEY=your_elevenlabs_key
    ELEVENLABS_VOICE_ID=your_voice_id
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```
    Commit this file

✅ **Milestone 2 Complete:** All API keys working and secured

---

## 🎯 MILESTONE 3: Tailwind Config & Design System
**Duration:** 30-45 minutes | **Hours 1.5-2**
**Owner:** Frontend Wizard (UI/UX Lead)

### Steps:
1. **Update `tailwind.config.ts` with custom colors**
   ```typescript
   colors: {
     'cosmic-navy': '#0a0e27',
     'nebula-purple': '#6a4c93',
     'star-blue': '#00d9ff',
     'meteor-gold': '#ffd700',
     'planet-teal': '#1dd3b0',
   }
   ```

2. **Add custom fonts** (optional - use Inter or Space Grotesk)
   - Update `app/layout.tsx` with Google Fonts
   - Or keep default Next.js font

3. **Create `app/globals.css` with custom styles**
   ```css
   body {
     @apply bg-cosmic-navy text-white;
   }
   ```

4. **Add gradient utilities**
   ```css
   .gradient-glow {
     background: linear-gradient(135deg, #6a4c93 0%, #00d9ff 100%);
   }
   ```

5. **Test Tailwind classes work**
   - Add a test div with `bg-star-blue` in `app/page.tsx`
   - Verify color appears correctly

6. **Create reusable button component** (`components/ui/Button.tsx`)
   ```typescript
   export function Button({ children, variant = 'primary' }) {
     // Styled with Tailwind
   }
   ```

7. **Create reusable card component** (`components/ui/Card.tsx`)
   ```typescript
   export function Card({ children, glowing = false }) {
     // Card with optional glow effect
   }
   ```

8. **Set up Framer Motion base configuration**
   ```typescript
   // lib/motion.ts
   export const fadeIn = {
     initial: { opacity: 0 },
     animate: { opacity: 1 },
     transition: { duration: 0.5 }
   };
   ```

9. **Create animation presets file** (`lib/animations.ts`)
   - Define common animations (slideUp, fadeIn, glow, etc.)

10. **Test a simple Framer Motion animation**
    - Add motion.div to homepage
    - Verify animation plays on load

11. **Create typography scale**
    - Define h1, h2, h3 styles in globals.css
    - Use space-themed naming (e.g., `.text-stellar` for headings)

12. **Set up responsive breakpoints documentation**
    - Document mobile-first approach
    - List breakpoints: sm (640px), md (768px), lg (1024px)

13. **Create color palette reference component** (for dev use)
    ```typescript
    // components/dev/ColorPalette.tsx
    // Shows all colors visually
    ```

14. **Test responsive design basics**
    - View app on mobile viewport (DevTools)
    - Verify no horizontal scroll

15. **Commit design system**
    ```bash
    git add .
    git commit -m "Add Tailwind config and design system"
    git push origin main
    ```

✅ **Milestone 3 Complete:** Design system ready to use

---

## 🎯 MILESTONE 4: Gemini API Integration
**Duration:** 60-90 minutes | **Hours 2-3.5**
**Owner:** AI Architect (Gemini Lead)

### Steps:
1. **Create Gemini API wrapper** (`lib/gemini.ts`)
   ```typescript
   import { GoogleGenerativeAI } from '@google/generative-ai';

   export async function askGemini(question: string) {
     // Implementation
   }
   ```

2. **Set up Gemini model configuration**
   - Use `gemini-2.0-flash-exp` model
   - Set temperature to 0.7 for creative but consistent responses

3. **Create system prompt for Captain Gemini**
   ```typescript
   const SYSTEM_PROMPT = `You are Captain Gemini, an AI financial advisor
   who uses space metaphors...`;
   ```

4. **Test Gemini responds to simple question**
   - Question: "How do I save money?"
   - Verify response includes space metaphors

5. **Create API route** (`app/api/gemini/route.ts`)
   ```typescript
   export async function POST(req: Request) {
     const { question } = await req.json();
     const response = await askGemini(question);
     return Response.json({ response });
   }
   ```

6. **Add error handling for API limits**
   - Catch rate limit errors (429)
   - Return friendly error message

7. **Add response caching logic**
   ```typescript
   // Cache responses in memory or localStorage
   const cache = new Map();
   ```

8. **Create financial advice prompt templates**
   - Budget questions
   - Credit questions
   - Goal-setting questions

9. **Generate 15-20 pre-cached Q&A pairs**
   - Ask Gemini common questions
   - Save responses to `data/cached-responses.json`

10. **Create fallback response system**
    - If API fails, serve from cache
    - Add "offline mode" indicator

11. **Add response streaming (optional)**
    - Use Gemini streaming API
    - Display response word-by-word for better UX

12. **Test API route with curl or Postman**
    ```bash
    curl -X POST http://localhost:3000/api/gemini \
      -H "Content-Type: application/json" \
      -d '{"question":"How do I budget?"}'
    ```

13. **Add TypeScript types for API responses**
    ```typescript
    export interface GeminiResponse {
      response: string;
      cached: boolean;
      timestamp: number;
    }
    ```

14. **Create rate limit tracking**
    - Count API calls per minute
    - Warn when approaching limit (13/15 calls)

15. **Document API in README**
    ```markdown
    ## Gemini API Endpoint
    POST /api/gemini
    Body: { "question": "string" }
    Response: { "response": "string" }
    ```

✅ **Milestone 4 Complete:** Gemini API fully integrated and tested

---

## 🎯 MILESTONE 5: ElevenLabs Voice Integration
**Duration:** 60-90 minutes | **Hours 3.5-5**
**Owner:** Voice & Audio Engineer (ElevenLabs Lead)

### Steps:
1. **Create ElevenLabs API wrapper** (`lib/elevenlabs.ts`)
   ```typescript
   export async function generateSpeech(text: string) {
     // Call ElevenLabs TTS API
     // Return audio buffer
   }
   ```

2. **Set up ElevenLabs API endpoint** (`app/api/voice/route.ts`)
   ```typescript
   export async function POST(req: Request) {
     const { text } = await req.json();
     const audio = await generateSpeech(text);
     return new Response(audio, {
       headers: { 'Content-Type': 'audio/mpeg' }
     });
   }
   ```

3. **Test API generates audio**
   - Send "Welcome Navigator" request
   - Verify MP3 audio is returned

4. **Set up Howler.js audio player** (`lib/audio.ts`)
   ```typescript
   import { Howl } from 'howler';

   export function playAudio(audioUrl: string) {
     const sound = new Howl({ src: [audioUrl] });
     sound.play();
   }
   ```

5. **Create VoicePlayer component** (`components/VoicePlayer.tsx`)
   - Play/pause button
   - Loading indicator while generating
   - Volume control (optional)

6. **Add audio waveform animation** (optional)
   - Use Framer Motion to animate bars while playing
   - Sync with audio playback

7. **Implement audio caching system**
   - Save generated audio to `public/audio/`
   - Hash text to create unique filenames
   - Check cache before generating new audio

8. **Pre-generate 15-20 voice clips**
   - For common demo questions
   - For Captain Gemini intro: "Welcome, Navigator..."
   - For mission completion sounds

9. **Add audio preloading**
   ```typescript
   // Preload critical audio on page load
   useEffect(() => {
     preloadAudio(['/audio/welcome.mp3', '/audio/mission-complete.mp3']);
   }, []);
   ```

10. **Create audio queue system**
    - Queue multiple messages if user asks questions quickly
    - Play sequentially, not simultaneously

11. **Add "Captain is speaking" indicator**
    - Visual cue (pulsing icon) while audio plays
    - Disable input while speaking (optional)

12. **Test character limit tracking**
    - Track ElevenLabs character usage
    - Warn at 8,000/10,000 chars (80% threshold)

13. **Implement silent mode toggle**
    - Let users disable voice if needed
    - Store preference in localStorage

14. **Add error handling for audio generation**
    - If API fails, show text only
    - Display friendly message: "Captain's voice offline"

15. **Test on different browsers**
    - Chrome, Firefox, Safari
    - Ensure Howler.js works correctly

✅ **Milestone 5 Complete:** Voice generation and playback working

---

## 🎯 MILESTONE 6: Basic Chat Interface
**Duration:** 60-90 minutes | **Hours 5-6.5**
**Owner:** Frontend Wizard + AI Architect

### Steps:
1. **Create chat page** (`app/chat/page.tsx`)
   ```typescript
   export default function ChatPage() {
     return <ChatInterface />;
   }
   ```

2. **Create ChatInterface component** (`components/ChatInterface.tsx`)
   - Message list
   - Input field
   - Send button

3. **Set up Zustand store for chat** (`lib/store.ts`)
   ```typescript
   interface ChatStore {
     messages: Message[];
     addMessage: (msg: Message) => void;
   }
   ```

4. **Create Message component** (`components/Message.tsx`)
   - User message (right-aligned)
   - Captain message (left-aligned, with avatar)

5. **Add message types**
   ```typescript
   interface Message {
     id: string;
     role: 'user' | 'assistant';
     content: string;
     timestamp: number;
     audioUrl?: string;
   }
   ```

6. **Implement send message flow**
   ```typescript
   async function sendMessage(text: string) {
     // Add user message
     // Call Gemini API
     // Add assistant response
     // Generate voice
   }
   ```

7. **Add loading state**
   - Show "Captain is thinking..." while waiting
   - Animated dots or spinner

8. **Integrate VoicePlayer into messages**
   - Add speaker icon to assistant messages
   - Auto-play when message appears (optional)

9. **Add scroll-to-bottom on new message**
   ```typescript
   const messagesEndRef = useRef(null);
   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   ```

10. **Style chat interface with space theme**
    - Dark background
    - Message bubbles with gradient borders
    - Captain avatar (use emoji or icon initially: 🚀)

11. **Add suggested questions chips**
    - Display 3-4 quick questions user can tap
    - Example: "How do I budget?", "What's a credit score?"

12. **Implement keyboard shortcuts**
    - Enter to send
    - Shift+Enter for new line

13. **Add character limit indicator**
    - Show count: "250/500 characters"
    - Prevent overly long messages

14. **Test full flow: type → send → Gemini response → voice plays**

15. **Make responsive for mobile**
    - Input stays at bottom on mobile keyboards
    - Messages stack properly

✅ **Milestone 6 Complete:** Chat interface fully functional

---

## 🎯 MILESTONE 7: Constellation Map (Star Map)
**Duration:** 90-120 minutes | **Hours 6.5-8.5**
**Owner:** Data Viz & Demo Lead + Frontend Wizard

### Steps:
1. **Create ConstellationMap component** (`components/ConstellationMap.tsx`)
   - Canvas or SVG-based
   - Render 3 planets: Budget, Credit, Goals

2. **Generate star field background**
   ```typescript
   // Randomly place 100-200 small stars
   const stars = Array.from({ length: 150 }, () => ({
     x: Math.random() * width,
     y: Math.random() * height,
     size: Math.random() * 2
   }));
   ```

3. **Create Planet component** (`components/Planet.tsx`)
   ```typescript
   interface PlanetProps {
     name: string;
     position: { x: number; y: number };
     size: number;
     color: string;
     glow: boolean;
   }
   ```

4. **Position 3 planets in triangle formation**
   - Budget Planet (left)
   - Credit Planet (right)
   - Goals Planet (top center)

5. **Add planet hover effects**
   - Scale up slightly (1.1x)
   - Increase glow intensity
   - Show planet name

6. **Implement planet click navigation**
   ```typescript
   onClick={() => router.push(`/planet/${planetId}`)}
   ```

7. **Add connecting lines between planets**
   - SVG lines connecting the 3 planets
   - Subtle animated dash effect (optional)

8. **Create mock user data** (`data/user-data.json`)
   ```json
   {
     "budgetScore": 75,
     "creditScore": 680,
     "goalsProgress": 40
   }
   ```

9. **Map user data to planet properties**
   - Higher scores = larger planets
   - Higher scores = brighter glow

10. **Add intro animation**
    - Planets fade in sequentially
    - Stars twinkle on load

11. **Make map responsive**
    - Scale planet positions based on viewport
    - Test on mobile (planets should be tappable)

12. **Add "zoom to planet" animation** (optional)
    - When clicking planet, zoom in before navigating
    - Use Framer Motion layoutId

13. **Create mini tutorial overlay**
    - First-time users see: "Click a planet to explore"
    - Dismiss button

14. **Test all 3 planets are clickable and navigate correctly**

15. **Add accessibility labels**
    - aria-label for each planet
    - Keyboard navigation support

✅ **Milestone 7 Complete:** Interactive constellation map working

---

## 🎯 MILESTONE 8: Planet Detail Pages & Data Viz
**Duration:** 90-120 minutes | **Hours 8.5-10.5**
**Owner:** Data Viz Lead + Frontend Wizard

### Steps:
1. **Create dynamic route** (`app/planet/[id]/page.tsx`)
   ```typescript
   export default function PlanetPage({ params }: { params: { id: string } }) {
     const planetId = params.id; // 'budget', 'credit', or 'goals'
   }
   ```

2. **Create PlanetHeader component**
   - Large planet visual at top
   - Planet name and tagline
   - Back to map button

3. **Create mock spending data** (`data/spending.json`)
   ```json
   {
     "categories": [
       { "name": "Food", "amount": 450 },
       { "name": "Rent", "amount": 1200 },
       { "name": "Entertainment", "amount": 200 }
     ]
   }
   ```

4. **Create SpendingChart component** (`components/SpendingChart.tsx`)
   - Use Recharts PieChart
   - Show category breakdown

5. **Add Budget Planet content**
   - Spending chart
   - Monthly budget vs actual
   - Top spending categories

6. **Create mock credit data** (`data/credit.json`)
   ```json
   {
     "score": 680,
     "utilization": 30,
     "accounts": 3
   }
   ```

7. **Create CreditScoreGauge component**
   - Use Recharts RadialBarChart
   - Show score out of 850
   - Color-coded (red/yellow/green)

8. **Add Credit Planet content**
   - Credit score gauge
   - Credit utilization chart
   - Tips to improve score

9. **Create mock goals data** (`data/goals.json`)
   ```json
   {
     "goals": [
       { "name": "Emergency Fund", "target": 5000, "current": 2000 },
       { "name": "Vacation", "target": 3000, "current": 800 }
     ]
   }
   ```

10. **Create GoalProgressBar component**
    - Progress bar for each goal
    - Show percentage complete
    - Days/months remaining

11. **Add Goals Planet content**
    - List of active goals
    - Progress bars
    - "Add new goal" button (can be non-functional for demo)

12. **Style all planet pages consistently**
    - Same header layout
    - Card-based content sections
    - Space theme maintained

13. **Add smooth transitions between pages**
    - Page transition animation
    - Framer Motion AnimatePresence

14. **Test all 3 planet pages load correctly**
    - /planet/budget
    - /planet/credit
    - /planet/goals

15. **Make charts responsive**
    - Test on mobile
    - Charts should resize properly

✅ **Milestone 8 Complete:** All 3 planet pages with visualizations

---

## 🎯 MILESTONE 9: Gamification (Missions, XP, Badges)
**Duration:** 90-120 minutes | **Hours 10.5-12.5**
**Owner:** AI Architect + Frontend Wizard

### Steps:
1. **Create mission types** (`lib/missions.ts`)
   ```typescript
   interface Mission {
     id: string;
     title: string;
     description: string;
     xp: number;
     completed: boolean;
   }
   ```

2. **Create mock missions** (`data/missions.json`)
   ```json
   [
     {
       "id": "budget-tracker",
       "title": "Budget Tracker",
       "description": "Track spending for 7 days",
       "xp": 100
     }
   ]
   ```

3. **Add missions to Zustand store**
   ```typescript
   interface GameStore {
     missions: Mission[];
     xp: number;
     level: number;
     completeMission: (id: string) => void;
   }
   ```

4. **Create MissionCard component** (`components/MissionCard.tsx`)
   - Mission title and description
   - XP reward badge
   - Checkmark when completed

5. **Create XPBar component** (`components/XPBar.tsx`)
   - Progress bar showing XP to next level
   - Current level display
   - Example: "Level 2 - 150/300 XP"

6. **Add XP bar to top of every page**
   - Small, non-intrusive
   - Sticky header (optional)

7. **Create missions section on homepage**
   - Display 3 active missions
   - "View all missions" link

8. **Implement XP gain animation**
   - When mission completed, show "+100 XP" floating text
   - Use Framer Motion

9. **Create badge system** (`data/badges.json`)
   ```json
   [
     {
       "id": "first-steps",
       "name": "First Steps",
       "icon": "🌟",
       "requirement": "Complete first mission"
     }
   ]
   ```

10. **Create Badge component** (`components/Badge.tsx`)
    - Badge icon/emoji
    - Badge name
    - Locked/unlocked state

11. **Add badge display to user profile section**
    - Grid of badges
    - Locked badges shown in grayscale

12. **Implement badge unlock animation**
    - Modal popup when badge unlocked
    - "Achievement Unlocked!" message
    - Confetti effect (use canvas-confetti library - optional)

13. **Link missions to chat interactions**
    - Example: Asking about budgeting = completes "Ask Captain" mission
    - Increment XP automatically

14. **Create level-up animation**
    - When XP reaches threshold, level increases
    - Full-screen flash effect
    - "Level Up!" message

15. **Test full gamification loop**
    - Complete mission → Gain XP → Unlock badge → Level up

✅ **Milestone 9 Complete:** Gamification system fully working

---

## 🎯 MILESTONE 10: Polish, Deploy, Demo & Submission
**Duration:** Remaining hours | **Hours 12.5-24**
**Owners:** Entire team

### Steps:
1. **Code cleanup sprint (30 minutes)**
   - Remove console.logs
   - Delete unused components
   - Fix TypeScript errors

2. **Responsive design check (30 minutes)**
   - Test on iPhone, Android, tablet
   - Fix any layout issues
   - Ensure all buttons are tappable

3. **Add loading states everywhere**
   - Skeleton screens for slow loads
   - Spinners for API calls
   - "Captain is thinking..." messages

4. **Add error boundaries**
   ```typescript
   // app/error.tsx
   export default function Error({ error, reset }) {
     return <div>Something went wrong: {error.message}</div>;
   }
   ```

5. **Create 404 page** (`app/not-found.tsx`)
   - Space-themed 404
   - "Lost in space" message
   - Link back to home

6. **Performance optimization**
   - Add `loading.tsx` for instant loading states
   - Lazy load components (use `dynamic` from Next.js)
   - Optimize images

7. **Deploy to Cloudflare Pages**
   - Connect GitHub repo
   - Set environment variables in Cloudflare dashboard
   - Deploy preview: https://xplanet.pages.dev

8. **Test deployed site**
   - Check all features work
   - Verify API routes work
   - Test on real devices

9. **Create demo script** (refer to context doc)
   - Write exact steps for 2-minute demo
   - Practice 3 times

10. **Record demo video (critical!)**
    - Use Loom, OBS, or screen recording
    - 2 minutes max
    - Show: Map → Click planet → Chat → Voice response → Mission complete

11. **Edit demo video**
    - Add intro text: "XPlanet - Navigate Your Financial Galaxy"
    - Add background music (space theme)
    - Export in 1080p

12. **Create pitch deck (7 slides)**
    - Slide 1: Problem
    - Slide 2: Solution (XPlanet)
    - Slide 3: Demo screenshot
    - Slide 4: Tech stack
    - Slide 5: Gemini integration
    - Slide 6: ElevenLabs integration
    - Slide 7: Impact & future

13. **Write DevPost submission**
    - Catchy tagline
    - Description with emojis
    - Tech stack section
    - Challenges faced
    - What's next

14. **Submit to prize tracks**
    - Google Gemini track (mention heavy API usage)
    - ElevenLabs track (mention voice feature)
    - Capital One track (mention financial education)
    - Cloudflare track (mention hosting)

15. **Final team check-in**
    - Everyone reviews submission
    - Practice live demo one last time
    - Celebrate! 🎉

✅ **MILESTONE 10 COMPLETE: PROJECT SUBMITTED!**

---

## 📋 ROLE-SPECIFIC QUICK REFERENCE

### AI Architect (Gemini Lead)
**Focus on:** Milestones 4, 9
- Build Gemini wrapper
- Create financial prompts
- Generate cached responses
- Design mission logic

### Voice & Audio Engineer (ElevenLabs Lead)
**Focus on:** Milestone 5
- Build ElevenLabs wrapper
- Create audio player
- Pre-generate voice clips
- Implement caching

### Frontend Wizard (UI/UX Lead)
**Focus on:** Milestones 3, 6, 7, 8
- Design system
- Chat interface
- Constellation map
- Planet pages

### Data Viz & Demo Lead
**Focus on:** Milestones 8, 10
- Recharts integration
- Planet visualizations
- Demo video
- Pitch deck

### Project Manager (You!)
**Focus on:** All milestones
- Unblock team members
- Coordinate check-ins
- Make cut decisions
- Submit to DevPost

---

## 🚨 EMERGENCY DECISION FRAMEWORK

### Hour 6 Check
**Question:** Is chat with voice working?
- ✅ YES → Continue to Milestone 7
- ❌ NO → Pair up team, focus only on this until working

### Hour 12 Check (CRITICAL)
**Question:** Can we finish all features by Hour 18?
- ✅ YES → Continue as planned
- ❌ NO → **CUT FEATURES IMMEDIATELY**

**Cut priority:**
1. Extra animations/polish
2. Goals planet (keep only Budget + Credit)
3. Badge system
4. Voice input

**Never cut:**
- Gemini chat
- Voice output
- Star map
- Demo video

### Hour 18: FEATURE FREEZE
- No new features after this point
- Only bug fixes
- Focus on demo prep

---

## ✅ DEFINITION OF DONE (Each Milestone)

A milestone is only complete when:
1. Code is pushed to GitHub
2. All team members can pull and run it
3. Feature works on deployed site (after Hour 12)
4. No critical bugs blocking next milestone

---

## 🎯 SUCCESS METRICS

**Minimum Viable Demo (Must Have):**
- ✅ User can type question
- ✅ Gemini responds
- ✅ Voice plays out loud
- ✅ Star map shows 3 planets
- ✅ One planet page works

**Complete Demo (Goal):**
- ✅ All above +
- ✅ All 3 planet pages with charts
- ✅ Mission system working
- ✅ XP and level up
- ✅ Smooth animations

**Stretch Goals:**
- Voice input (speech-to-text)
- Real-time multiplayer
- Mobile app (PWA)
- AI-generated missions

---

## 📞 COMMUNICATION PLAN

**Standups (15 min each):**
- Hour 0: Kickoff + assign roles
- Hour 6: Check progress, adjust plan
- Hour 12: Critical decision point
- Hour 18: Feature freeze, demo prep
- Hour 22: Final check before submission

**Async updates:**
- Post in group chat every 2 hours with status

**Blockers:**
- DM project manager immediately
- Don't stay stuck >30 minutes

---

## 🎓 LEARNING RESOURCES (If Stuck)

- Next.js App Router: https://nextjs.org/docs/app
- Gemini API: https://ai.google.dev/docs
- ElevenLabs API: https://elevenlabs.io/docs
- Recharts: https://recharts.org/en-US/
- Framer Motion: https://www.framer.com/motion/

---

**LAST UPDATED:** Start of hackathon
**TEAM:** 4 awesome developers
**GOAL:** Build something amazing in 24 hours! 🚀

---

END OF ROADMAP

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Captain Gemini's personality and system prompt
const SYSTEM_PROMPT = `You are Captain Gemini, an AI financial advisor with a passion for space exploration.
You help users navigate their financial galaxy using space metaphors and analogies.

Your personality:
- Enthusiastic about both finance and space
- Use space metaphors (orbit, navigate, launch, gravity, constellation, etc.)
- Keep advice practical and actionable
- Be encouraging and supportive
- Keep responses concise (2-3 paragraphs max)

Examples of your style:
- "Your budget is like a spacecraft - you need the right fuel (income) and trajectory (spending plan) to reach your destination!"
- "Credit scores are like gravitational pull - the stronger they are, the more financial opportunities orbit around you."
- "Think of your emergency fund as your life support system in the financial void."

Always end with an encouraging space-themed sign-off like:
"Keep navigating, Navigator! 🚀"
`;

export interface GeminiResponse {
  response: string;
  cached: boolean;
  timestamp: number;
}

/**
 * Ask Captain Gemini a financial question with user context
 */
export async function askGemini(question: string, userData?: any): Promise<GeminiResponse> {
  try {
    // Build context from user data
    let contextPrompt = question;

    if (userData) {
      const monthlyIncome = Math.round((userData.income || 0) / 12);
      const totalExpenses = userData.expenses
        ? Object.values(userData.expenses).reduce((sum: number, val: any) => sum + (val || 0), 0)
        : 0;
      const totalDebts = userData.debts
        ? Object.values(userData.debts).reduce((sum: number, val: any) => sum + (val || 0), 0)
        : 0;

      const context = `
User Context:
- Name: ${userData.name || 'Navigator'}
- Age: ${userData.age || 'unknown'}
- Monthly Income: $${monthlyIncome.toLocaleString()}
- Total Monthly Expenses: $${totalExpenses.toLocaleString()}
- Monthly Savings: $${Math.max(0, monthlyIncome - totalExpenses).toLocaleString()}
- Credit Score: ${userData.creditScore || 'unknown'}
- Total Debt: $${totalDebts.toLocaleString()}

User's Question: ${question}

Address the user by name (${userData.name || 'Navigator'}) and reference their specific financial situation when relevant.`;

      contextPrompt = context;
    }

    // Use Gemini 2.0 Flash (fast and efficient)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Generate response
    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const text = response.text();

    return {
      response: text,
      cached: false,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Gemini API Error:', error);

    // Fallback response if API fails
    return {
      response: `Houston, we have a problem! 🛸 I'm having trouble connecting to my knowledge base right now. Please try again in a moment, ${userData?.name || 'Navigator'}!`,
      cached: false,
      timestamp: Date.now(),
    };
  }
}

/**
 * Generate personalized financial missions based on user data
 */
export async function generateMissions(userData: {
  budgetScore: number;
  creditScore: number;
  goalsProgress: number;
}): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const prompt = `Based on this financial data:
- Budget Score: ${userData.budgetScore}/100
- Credit Score: ${userData.creditScore}
- Goals Progress: ${userData.goalsProgress}%

Generate 3 personalized financial missions (goals/tasks) for this user.
Make them actionable, specific, and achievable.
Format as a JSON array of strings.
Use space-themed language but keep goals practical.

Example: ["Launch your emergency fund to $1000", "Navigate to a 700+ credit score", "Chart a course to save $200 this month"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to parse JSON, fallback to default missions
    try {
      const missions = JSON.parse(text);
      return Array.isArray(missions) ? missions : getDefaultMissions();
    } catch {
      return getDefaultMissions();
    }
  } catch (error) {
    console.error('Mission generation error:', error);
    return getDefaultMissions();
  }
}

function getDefaultMissions(): string[] {
  return [
    "Track your spending for 7 days to map your financial orbit",
    "Save $100 this month for your emergency fuel reserve",
    "Review your credit report to check your financial trajectory",
  ];
}

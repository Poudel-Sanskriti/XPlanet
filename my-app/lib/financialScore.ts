import { askGemini } from './gemini';
import type { UserProfile } from './userData';

export interface OrbitScore {
  score: number; // 0-100
  grade: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  strengths: string[];
  improvements: string[];
  orbitStrength: 'Unstable' | 'Developing' | 'Stable' | 'Strong';
}

export async function calculateOrbitScore(userData: UserProfile): Promise<OrbitScore> {
  const totalExpenses = userData.expenses.rent + userData.expenses.utilities;
  const totalDebts = Object.values(userData.debts).reduce((sum, debt) => sum + debt, 0);
  const savingsRate = userData.goals.reduce((sum, goal) => sum + goal.current, 0) / userData.income;

  const prompt = `You are a financial analyst. Analyze this person's financial health and provide a score from 0-100, where:
- 0-40: Poor financial health
- 41-60: Fair financial health
- 61-80: Good financial health
- 81-100: Excellent financial health

Financial Data:
- Monthly Income: $${userData.income}
- Monthly Expenses: $${totalExpenses}
- Total Debt: $${totalDebts}
- Credit Score: ${userData.creditScore}
- Emergency Savings: $${userData.goals.find(g => g.name.includes('Emergency'))?.current || 0}
- Active Financial Goals: ${userData.goals.length}

Provide your analysis in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"]
}`;

  try {
    const response = await askGemini(prompt, userData);

    // Parse Gemini's JSON response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = response.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', response.response);
      // Fallback to basic calculation
      return calculateBasicScore(userData);
    }

    const score = Math.min(100, Math.max(0, parsedResponse.score));

    return {
      score,
      grade: getGrade(score),
      strengths: parsedResponse.strengths || [],
      improvements: parsedResponse.improvements || [],
      orbitStrength: getOrbitStrength(score),
    };
  } catch (error) {
    console.error('Error calculating orbit score:', error);
    return calculateBasicScore(userData);
  }
}

// Fallback calculation if Gemini fails
function calculateBasicScore(userData: UserProfile): OrbitScore {
  const totalExpenses = userData.expenses.rent + userData.expenses.utilities;
  const totalDebts = Object.values(userData.debts).reduce((sum, debt) => sum + debt, 0);
  const savingsRate = userData.goals.reduce((sum, goal) => sum + goal.current, 0) / userData.income;

  let score = 50; // Start at middle

  // Positive factors
  if (userData.creditScore >= 700) score += 15;
  if (savingsRate > 0.1) score += 10;
  if (totalExpenses < userData.income * 0.5) score += 15;

  // Negative factors
  if (totalDebts > userData.income * 2) score -= 15;
  if (totalExpenses > userData.income * 0.8) score -= 10;

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    grade: getGrade(score),
    strengths: ['Maintaining credit score', 'Tracking finances'],
    improvements: ['Build emergency fund', 'Reduce debt', 'Increase savings rate'],
    orbitStrength: getOrbitStrength(score),
  };
}

function getGrade(score: number): OrbitScore['grade'] {
  if (score >= 81) return 'Excellent';
  if (score >= 61) return 'Good';
  if (score >= 41) return 'Fair';
  return 'Poor';
}

function getOrbitStrength(score: number): OrbitScore['orbitStrength'] {
  if (score >= 81) return 'Strong';
  if (score >= 61) return 'Stable';
  if (score >= 41) return 'Developing';
  return 'Unstable';
}

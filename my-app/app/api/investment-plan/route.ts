import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      monthlyInvestable,
      yearlyInvestable,
      age,
      riskTolerance,
      timeHorizon,
    } = body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const timeHorizonYears = timeHorizon === 'short' ? 3 : 10;
    const timeHorizonLabel = timeHorizon === 'short' ? 'Short-Term (0-5 years)' : 'Long-Term (5+ years)';

    const prompt = `You are a financial advisor helping a client create a ${timeHorizonLabel} investment plan.

CLIENT PROFILE:
- Age: ${age}
- Monthly Investable Amount: $${monthlyInvestable.toFixed(2)}
- Yearly Investable Amount: $${yearlyInvestable.toFixed(2)}
- Risk Tolerance: ${riskTolerance}
- Investment Time Horizon: ${timeHorizonYears} years

TASK:
Create a personalized ${timeHorizon}-term investment plan. Structure your response with these sections:

1. RECOMMENDED ALLOCATION
   Break down the investment allocation by percentage and dollar amount for ${timeHorizon === 'short' ? 'low-risk options like high-yield savings, CDs, Treasury bills, and bonds' : 'long-term growth vehicles like index funds, ETFs, retirement accounts (Roth IRA, 401k), and potentially individual stocks'}.

2. SPECIFIC INVESTMENT RECOMMENDATIONS
   Provide 3-5 specific investment vehicles the client should consider (e.g., "Vanguard S&P 500 Index Fund (VOO)", "Ally Bank High-Yield Savings (4.5% APY)", "Roth IRA at Fidelity").

3. PROJECTED RETURNS (${timeHorizonYears} years)
   Calculate potential portfolio values after ${timeHorizonYears} years with monthly contributions of $${monthlyInvestable.toFixed(2)} at different return rates:
   - Conservative Scenario: ${timeHorizon === 'short' ? '3-4% annual return' : '6-7% annual return'}
   - Moderate Scenario: ${timeHorizon === 'short' ? '4-5% annual return' : '8-9% annual return'}
   - Aggressive Scenario: ${timeHorizon === 'short' ? '5-6% annual return' : '10-12% annual return'}

   Use the compound interest formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
   Where: P = monthly contribution, r = monthly rate, n = months

4. ACTION STEPS
   Provide 4-5 concrete, actionable steps the client can take TODAY to start implementing this plan (e.g., "Open a Roth IRA account at Vanguard", "Set up automatic monthly transfers of $X").

5. KEY CONSIDERATIONS
   Mention 2-3 important factors specific to their situation (age, risk tolerance, time horizon).

FORMAT: Use clear headings, bullet points, and dollar amounts. Be specific and practical. Keep explanations concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plan = response.text();

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating investment plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate investment plan' },
      { status: 500 }
    );
  }
}

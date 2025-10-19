import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';

export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'access_token is required' },
        { status: 400 }
      );
    }

    const response = await plaidClient.accountsBalanceGet({
      access_token,
    });

    const accounts = response.data.accounts.map((account) => ({
      id: account.account_id,
      name: account.name,
      officialName: account.official_name,
      type: account.type,
      subtype: account.subtype,
      balance: {
        current: account.balances.current,
        available: account.balances.available,
        limit: account.balances.limit,
        currency: account.balances.iso_currency_code,
      },
      mask: account.mask,
    }));

    return NextResponse.json({
      accounts,
      institution: response.data.item,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

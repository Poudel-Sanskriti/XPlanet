'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { motion } from 'framer-motion';
import { getUserData, updateUserData } from '@/lib/userData';

interface PlaidLinkProps {
  onSuccess?: () => void;
  onExit?: () => void;
}

export function PlaidLink({ onSuccess, onExit }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Create link token when component mounts
    const createLinkToken = async () => {
      try {
        const userData = getUserData();
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userData?.name || 'user-' + Date.now(),
          }),
        });

        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };

    createLinkToken();
  }, []);

  const onSuccessCallback = useCallback(
    async (public_token: string, metadata: any) => {
      setIsConnecting(true);

      try {
        // Exchange public token for access token
        const response = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_token }),
        });

        const data = await response.json();

        if (data.success) {
          // Save access token to user data
          const userData = getUserData();

          // Initialize plaidAccounts array if it doesn't exist
          const existingAccounts = userData.plaidAccounts || [];

          // Add new account to the array
          const newAccount = {
            accessToken: data.access_token,
            itemId: data.item_id,
            institutionName: metadata.institution?.name || 'Bank',
            institutionId: metadata.institution?.institution_id || '',
          };

          updateUserData({
            ...userData,
            plaidAccounts: [...existingAccounts, newAccount],
            // Also update legacy fields for backward compatibility
            plaidAccessToken: data.access_token,
            plaidItemId: data.item_id,
            plaidConnected: true,
            plaidInstitution: metadata.institution?.name || 'Bank',
          });

          // Fetch initial transaction data
          await fetch('/api/plaid/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: data.access_token,
            }),
          }).then(async (res) => {
            const transactionData = await res.json();
            // Cache transactions
            localStorage.setItem('plaidTransactions', JSON.stringify(transactionData));
            localStorage.setItem('plaidCacheTime', Date.now().toString());
          });

          onSuccess?.();
        }
      } catch (error) {
        console.error('Error exchanging token:', error);
      } finally {
        setIsConnecting(false);
      }
    },
    [onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onSuccessCallback,
    onExit: () => {
      onExit?.();
    },
  });

  const userData = getUserData();
  const connectedBanks = userData?.plaidAccounts || [];
  const hasConnectedBanks = connectedBanks.length > 0;

  return (
    <div className="space-y-4">
      {/* Show connected banks */}
      {hasConnectedBanks && (
        <div className="space-y-3">
          {connectedBanks.map((bank, index) => (
            <div
              key={bank.itemId}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-bold text-green-400">{bank.institutionName}</h4>
                  <p className="text-sm text-gray-400">Connected and syncing</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Button to connect another bank */}
      <div className="text-center">
        <motion.button
          onClick={() => open()}
          disabled={!ready || isConnecting}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600
                     hover:from-blue-700 hover:to-cyan-700
                     text-white font-bold rounded-full
                     shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : hasConnectedBanks ? (
            '➕ Connect Another Bank'
          ) : (
            '🔗 Connect Your Bank Account'
          )}
        </motion.button>
        {!hasConnectedBanks && (
          <p className="mt-4 text-sm text-gray-400">
            Securely link your bank to automatically track spending
          </p>
        )}
      </div>
    </div>
  );
}

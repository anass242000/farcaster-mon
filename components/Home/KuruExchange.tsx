"use client";

import React, { useState, useEffect } from 'react';
import { KuruToken, fetchAvailableKuruTokens, executeKuruExchange } from '../../lib/kuruApi';

export function KuruExchange() {
  const [availableTokens, setAvailableTokens] = useState<KuruToken[]>([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeResult, setExchangeResult] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await fetchAvailableKuruTokens();
        setAvailableTokens(response.tokens);
        console.log('Available tokens:', response.tokens); // For verification
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        setExchangeResult('Failed to load token list.');
      }
    };
    loadTokens();
  }, []);

  const handleExchange = async () => {
    if (!fromToken || !toToken || !amount) {
      setExchangeResult('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setExchangeResult(null);
    try {
      // For now, we assume fromToken and toToken inputs are the token IDs
      const response = await executeKuruExchange({
        fromTokenId: fromToken,
        toTokenId: toToken,
        amount: amount,
      });
      if (response.success) {
        setExchangeResult(response.message || 'Exchange successful!');
      } else {
        setExchangeResult(response.message || 'Exchange failed.');
      }
    } catch (error) {
      console.error('Exchange error:', error);
      setExchangeResult('An error occurred during the exchange.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">Kuru Token Exchange</h2>
      <div className="flex flex-col space-y-3">
        <div>
          <label htmlFor="fromToken" className="block text-sm font-medium text-gray-300">From Token:</label>
          <input
            type="text"
            id="fromToken"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            placeholder="e.g., ETH (see console for fetched)"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          />
        </div>
        <div>
          <label htmlFor="toToken" className="block text-sm font-medium text-gray-300">To Token:</label>
          <input
            type="text"
            id="toToken"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            placeholder="e.g., MONAD (see console for fetched)"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount:</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 1.0"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          />
        </div>
        <button
          onClick={handleExchange}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Exchanging...' : 'Exchange'}
        </button>
        {exchangeResult && (
          <p className={`text-sm ${exchangeResult.startsWith('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
            {exchangeResult}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { formatUnits, parseUnits } from "viem";
import { useChainId, useConfig, useAccount } from "wagmi";
import { chainsToTSender } from "@/constants";
import getApprovedAmount from "@/utils/checkAllowance";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);

  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();

  // Parse recipients and amounts
  const parsedData = useMemo(() => {
    const recipientList = recipients
      .split(/[,\n]/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);

    const amountList = amounts
      .split(/[,\n]/)
      .map((amt) => amt.trim())
      .filter((amt) => amt.length > 0);

    const totalWei = amountList.reduce((sum, amt) => {
      try {
        return sum + BigInt(amt);
      } catch {
        return sum;
      }
    }, BigInt(0));

    const totalTokens =
      totalWei > 0 ? formatUnits(totalWei, tokenDecimals) : "0.00";

    return {
      recipientCount: recipientList.length,
      amountCount: amountList.length,
      totalWei: totalWei.toString(),
      totalTokens,
    };
  }, [recipients, amounts, tokenDecimals]);

  const handleSendTokens = async () => {
    // Get chain and tsender address
    const tsenderAddress = chainId ? chainsToTSender[chainId]?.tsender : null;

    if (!tsenderAddress) {
      alert("TSender contract not found for this chain!");
      return;
    }

    if (!account.address) {
      alert("Please connect your wallet!");
      return;
    }

    console.log("🔍 Checking allowance...", {
      chainId,
      tsenderAddress,
      tokenAddress,
      userAddress: account.address,
    });

    try {
      // Call helper function to check allowance
      const currentAllowance = await getApprovedAmount(
        tsenderAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        account.address
      );

      const requiredAmount = BigInt(parsedData.totalWei);

      console.log("✅ Allowance check complete:", {
        currentAllowance: currentAllowance.toString(),
        requiredAmount: requiredAmount.toString(),
        sufficient: currentAllowance >= requiredAmount,
      });

      if (currentAllowance < requiredAmount) {
        alert(
          `Insufficient allowance!\n\nCurrent: ${formatUnits(
            currentAllowance,
            tokenDecimals
          )} tokens\nRequired: ${
            parsedData.totalTokens
          } tokens\n\nPlease approve the TSender contract first.`
        );
        return;
      }
      // TODO: Implement token sending logic
    } catch (error) {
      console.error("❌ Error checking allowance:", error);
      alert(
        `Error checking allowance: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">T-Sender</h1>
        </div>

        {/* Token Address Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 cursor-text text-gray-900"
          />
        </div>

        {/* Recipients Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients (comma or new line separated)
          </label>
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="0x123..., 0x456...&#10;0x789..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400 cursor-text text-gray-900"
          />
        </div>

        {/* Amounts Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amounts (wei; comma or new line separated)
          </label>
          <textarea
            value={amounts}
            onChange={(e) => setAmounts(e.target.value)}
            placeholder="100, 200, 300...&#10;400, 500..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400 cursor-text text-gray-900"
          />
        </div>

        {/* Transaction Details */}
        <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transaction Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Token Name:</span>
              <span className="font-medium text-gray-900">
                {tokenName || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount (wei):</span>
              <span className="font-mono text-gray-900">
                {parsedData.totalWei}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount (tokens):</span>
              <span className="font-mono text-gray-900">
                {parsedData.totalTokens}
              </span>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendTokens}
          disabled={!tokenAddress || !recipients || !amounts}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Send Tokens
        </button>
      </div>
    </div>
  );
}

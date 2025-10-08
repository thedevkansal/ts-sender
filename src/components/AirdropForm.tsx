"use client";

import { useState, useMemo } from "react";
import { formatUnits } from "viem";
import { useChainId, useConfig, useAccount } from "wagmi";
import { chainsToTSender } from "@/constants";
import { getApprovedAmount } from "@/utils/checkAllowance";
import { parseAirdropData } from "@/utils/parseAirdropData";
import { approveToken } from "@/utils/approveToken";
import { sendAirdrop } from "@/utils/sendAirdrop";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [isSending, setIsSending] = useState(false);

  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();

  // Parse recipients and amounts using utility function
  const parsedData = useMemo(() => {
    return parseAirdropData(recipients, amounts, tokenDecimals);
  }, [recipients, amounts, tokenDecimals]);

  const handleSendTokens = async () => {
    const tsenderAddress = chainId ? chainsToTSender[chainId]?.tsender : null;

    if (!tsenderAddress) {
      alert("TSender contract not found for this chain!");
      return;
    }

    if (!account.address) {
      alert("Please connect your wallet!");
      return;
    }

    setIsSending(true);

    try {
      console.log("🔍 Checking allowance...");

      // Check current allowance
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

      // If insufficient allowance, request approval
      if (currentAllowance < requiredAmount) {
        console.log("⚠️ Insufficient allowance, requesting approval...");

        try {
          await approveToken(
            tokenAddress as `0x${string}`,
            tsenderAddress as `0x${string}`,
            requiredAmount
          );
          console.log("✅ Approval successful!");
        } catch (approvalError) {
          console.error("❌ Approval failed:", approvalError);
          alert(
            `Approval failed: ${
              approvalError instanceof Error
                ? approvalError.message
                : "Unknown error"
            }`
          );
          setIsSending(false);
          return;
        }
      }

      // Send the airdrop transaction
      console.log("🚀 Sending airdrop...");

      // Convert parsed data to proper format
      const recipientAddresses = parsedData.recipientList as `0x${string}`[];
      const amountsBigInt = parsedData.amountList.map((amt) => {
        try {
          return BigInt(amt);
        } catch {
          throw new Error(`Invalid amount: ${amt}`);
        }
      });

      const txHash = await sendAirdrop(
        tsenderAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        recipientAddresses,
        amountsBigInt,
        requiredAmount
      );

      console.log("✅ Airdrop completed successfully!");
      alert(
        `✅ Airdrop successful!\n\nTransaction: ${txHash}\n\nTokens sent to ${parsedData.recipientCount} recipients.`
      );

      // Clear form after successful airdrop
      setRecipients("");
      setAmounts("");
    } catch (error) {
      console.error("❌ Error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSending(false);
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
                {parsedData.totalWeiString}
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
          disabled={!tokenAddress || !recipients || !amounts || isSending}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSending ? "Processing..." : "Send Tokens"}
        </button>
      </div>
    </div>
  );
}

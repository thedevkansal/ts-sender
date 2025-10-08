import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { tsenderAbi } from "@/constants";
import config from "@/rainbowkitConfig";

/**
 * Send ERC20 tokens to multiple recipients using TSender contract
 * @param tsenderAddress - Address of the TSender contract
 * @param tokenAddress - Address of the ERC20 token
 * @param recipients - Array of recipient addresses
 * @param amounts - Array of amounts (in wei) to send to each recipient
 * @param totalAmount - Total amount being sent
 * @returns Transaction hash
 */
export async function sendAirdrop(
  tsenderAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  recipients: `0x${string}`[],
  amounts: bigint[],
  totalAmount: bigint
): Promise<`0x${string}`> {
  console.log("🚀 Sending airdrop transaction...", {
    tsenderAddress,
    tokenAddress,
    recipientCount: recipients.length,
    totalAmount: totalAmount.toString(),
  });

  try {
    // Send airdrop transaction
    const txHash = await writeContract(config, {
      abi: tsenderAbi,
      address: tsenderAddress,
      functionName: "airdropERC20",
      args: [tokenAddress, recipients, amounts, totalAmount],
    });

    console.log("⏳ Airdrop transaction sent:", txHash);
    console.log("Waiting for confirmation...");

    // Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(config, {
      hash: txHash,
    });

    if (receipt.status === "success") {
      console.log("✅ Airdrop transaction confirmed!", receipt);
    } else {
      console.error("❌ Airdrop transaction failed", receipt);
      throw new Error("Airdrop transaction failed");
    }

    return txHash;
  } catch (error) {
    console.error("❌ Error sending airdrop:", error);
    throw error;
  }
}

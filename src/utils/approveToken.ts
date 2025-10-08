import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { erc20Abi } from "@/constants";
import config from "@/rainbowkitConfig";

/**
 * Approve a spender to spend tokens on behalf of the user
 * @param tokenAddress - Address of the ERC20 token
 * @param spenderAddress - Address of the spender (TSender contract)
 * @param amount - Amount to approve in wei
 * @returns Transaction hash
 */
export async function approveToken(
  tokenAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
  amount: bigint
): Promise<`0x${string}`> {
  console.log("📝 Requesting token approval...", {
    tokenAddress,
    spenderAddress,
    amount: amount.toString(),
  });

  try {
    // Send approve transaction
    const txHash = await writeContract(config, {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "approve",
      args: [spenderAddress, amount],
    });

    console.log("⏳ Approval transaction sent:", txHash);
    console.log("Waiting for confirmation...");

    // Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(config, {
      hash: txHash,
    });

    if (receipt.status === "success") {
      console.log("✅ Approval transaction confirmed!", receipt);
    } else {
      console.error("❌ Approval transaction failed", receipt);
      throw new Error("Approval transaction failed");
    }

    return txHash;
  } catch (error) {
    console.error("❌ Error approving token:", error);
    throw error;
  }
}

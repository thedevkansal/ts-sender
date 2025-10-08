import { formatUnits } from "viem";

export interface ParsedAirdropData {
  recipientList: string[];
  amountList: string[];
  totalWei: bigint;
  totalWeiString: string;
  totalTokens: string;
  recipientCount: number;
  amountCount: number;
}

/**
 * Parse recipients and amounts from comma or newline separated strings
 * and calculate total wei
 */
export function parseAirdropData(
  recipients: string,
  amounts: string,
  tokenDecimals: number = 18
): ParsedAirdropData {
  // Parse recipients
  const recipientList = recipients
    .split(/[,\n]/)
    .map((addr) => addr.trim())
    .filter((addr) => addr.length > 0);

  // Parse amounts
  const amountList = amounts
    .split(/[,\n]/)
    .map((amt) => amt.trim())
    .filter((amt) => amt.length > 0);

  // Calculate total wei
  const totalWei = amountList.reduce((sum, amt) => {
    try {
      return sum + BigInt(amt);
    } catch {
      return sum;
    }
  }, BigInt(0));

  // Format total tokens
  const totalTokens =
    totalWei > 0 ? formatUnits(totalWei, tokenDecimals) : "0.00";

  return {
    recipientList,
    amountList,
    totalWei,
    totalWeiString: totalWei.toString(),
    totalTokens,
    recipientCount: recipientList.length,
    amountCount: amountList.length,
  };
}

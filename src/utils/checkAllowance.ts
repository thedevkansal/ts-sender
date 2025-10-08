import { readContract } from "@wagmi/core";
import { erc20Abi } from "@/constants";
import config from "@/rainbowkitConfig";

export async function getApprovedAmount(
  spenderAddress: `0x${string}`,
  erc20TokenAddress: `0x${string}`,
  ownerAddress: `0x${string}`
): Promise<bigint> {
  console.log(`Checking allowance for token ${erc20TokenAddress}`);
  console.log(`Owner: ${ownerAddress}`);
  console.log(`Spender: ${spenderAddress}`);

  try {
    const allowance = await readContract(config, {
      abi: erc20Abi,
      address: erc20TokenAddress,
      functionName: "allowance",
      args: [ownerAddress, spenderAddress],
    });

    console.log("Raw allowance response:", allowance);
    return allowance as bigint;
  } catch (error) {
    console.error("Error fetching allowance:", error);
    throw new Error("Failed to fetch token allowance.");
  }
}

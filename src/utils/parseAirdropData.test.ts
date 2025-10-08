import { describe, it, expect } from "vitest";
import { parseAirdropData } from "./parseAirdropData";

describe("parseAirdropData", () => {
  describe("Comma-separated input", () => {
    it("should parse comma-separated recipients and amounts correctly", () => {
      const recipients = "0x123, 0x456, 0x789";
      const amounts = "100, 200, 300";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.recipientList).toEqual(["0x123", "0x456", "0x789"]);
      expect(result.amountList).toEqual(["100", "200", "300"]);
      expect(result.recipientCount).toBe(3);
      expect(result.amountCount).toBe(3);
    });

    it("should calculate total wei correctly for comma-separated amounts", () => {
      const recipients = "0x123, 0x456";
      const amounts = "1000000000000000000, 2000000000000000000"; // 1 + 2 ETH in wei

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.totalWei).toBe(BigInt("3000000000000000000"));
      expect(result.totalWeiString).toBe("3000000000000000000");
      expect(result.totalTokens).toBe("3");
    });
  });

  describe("Newline-separated input", () => {
    it("should parse newline-separated recipients and amounts correctly", () => {
      const recipients = "0xabc\n0xdef\n0xghi";
      const amounts = "500\n1000\n1500";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.recipientList).toEqual(["0xabc", "0xdef", "0xghi"]);
      expect(result.amountList).toEqual(["500", "1000", "1500"]);
      expect(result.recipientCount).toBe(3);
      expect(result.amountCount).toBe(3);
    });

    it("should calculate total wei correctly for newline-separated amounts", () => {
      const recipients = "0xabc\n0xdef";
      const amounts = "100\n200";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.totalWei).toBe(BigInt(300));
      expect(result.totalWeiString).toBe("300");
    });
  });

  describe("Mixed comma and newline-separated input", () => {
    it("should parse mixed separators correctly", () => {
      const recipients = "0x111, 0x222\n0x333, 0x444";
      const amounts = "100, 200\n300, 400";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.recipientList).toEqual([
        "0x111",
        "0x222",
        "0x333",
        "0x444",
      ]);
      expect(result.amountList).toEqual(["100", "200", "300", "400"]);
      expect(result.recipientCount).toBe(4);
      expect(result.amountCount).toBe(4);
      expect(result.totalWei).toBe(BigInt(1000));
    });
  });

  describe("Edge cases", () => {
    it("should handle empty strings", () => {
      const result = parseAirdropData("", "", 18);

      expect(result.recipientList).toEqual([]);
      expect(result.amountList).toEqual([]);
      expect(result.recipientCount).toBe(0);
      expect(result.amountCount).toBe(0);
      expect(result.totalWei).toBe(BigInt(0));
      expect(result.totalWeiString).toBe("0");
      expect(result.totalTokens).toBe("0.00");
    });

    it("should handle whitespace-only strings", () => {
      const result = parseAirdropData("   ", "   ", 18);

      expect(result.recipientList).toEqual([]);
      expect(result.amountList).toEqual([]);
      expect(result.recipientCount).toBe(0);
      expect(result.amountCount).toBe(0);
    });

    it("should trim whitespace from recipients and amounts", () => {
      const recipients = "  0x123  ,  0x456  ";
      const amounts = "  100  ,  200  ";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.recipientList).toEqual(["0x123", "0x456"]);
      expect(result.amountList).toEqual(["100", "200"]);
    });

    it("should filter out empty entries from multiple consecutive separators", () => {
      const recipients = "0x123,,,0x456";
      const amounts = "100,,,200";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.recipientList).toEqual(["0x123", "0x456"]);
      expect(result.amountList).toEqual(["100", "200"]);
      expect(result.recipientCount).toBe(2);
      expect(result.amountCount).toBe(2);
    });

    it("should handle invalid BigInt amounts gracefully", () => {
      const recipients = "0x123, 0x456, 0x789";
      const amounts = "100, invalid, 300";

      const result = parseAirdropData(recipients, amounts, 18);

      // Invalid amounts should be skipped in sum, but still in amountList
      expect(result.amountList).toEqual(["100", "invalid", "300"]);
      expect(result.totalWei).toBe(BigInt(400)); // Only 100 + 300
      expect(result.totalWeiString).toBe("400");
    });
  });

  describe("Token decimals", () => {
    it("should format total tokens correctly with 18 decimals (default)", () => {
      const recipients = "0x123";
      const amounts = "1000000000000000000"; // 1 ETH in wei

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.totalTokens).toBe("1");
    });

    it("should format total tokens correctly with 6 decimals (USDC)", () => {
      const recipients = "0x123, 0x456";
      const amounts = "1000000, 2000000"; // 1 + 2 USDC

      const result = parseAirdropData(recipients, amounts, 6);

      expect(result.totalWei).toBe(BigInt(3000000));
      expect(result.totalTokens).toBe("3");
    });

    it("should format total tokens correctly with 8 decimals (WBTC)", () => {
      const recipients = "0x123";
      const amounts = "100000000"; // 1 BTC

      const result = parseAirdropData(recipients, amounts, 8);

      expect(result.totalTokens).toBe("1");
    });

    it("should handle zero decimals", () => {
      const recipients = "0x123, 0x456";
      const amounts = "5, 10";

      const result = parseAirdropData(recipients, amounts, 0);

      expect(result.totalWei).toBe(BigInt(15));
      expect(result.totalTokens).toBe("15");
    });
  });

  describe("Large numbers", () => {
    it("should handle very large amounts", () => {
      const recipients = "0x123, 0x456";
      const amounts = "1000000000000000000000000, 2000000000000000000000000"; // 1M + 2M tokens

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result.totalWei).toBe(BigInt("3000000000000000000000000"));
      expect(result.totalWeiString).toBe("3000000000000000000000000");
      expect(result.totalTokens).toBe("3000000");
    });
  });

  describe("Return value structure", () => {
    it("should return all expected fields with correct types", () => {
      const recipients = "0x123, 0x456";
      const amounts = "100, 200";

      const result = parseAirdropData(recipients, amounts, 18);

      expect(result).toHaveProperty("recipientList");
      expect(result).toHaveProperty("amountList");
      expect(result).toHaveProperty("totalWei");
      expect(result).toHaveProperty("totalWeiString");
      expect(result).toHaveProperty("totalTokens");
      expect(result).toHaveProperty("recipientCount");
      expect(result).toHaveProperty("amountCount");

      expect(Array.isArray(result.recipientList)).toBe(true);
      expect(Array.isArray(result.amountList)).toBe(true);
      expect(typeof result.totalWei).toBe("bigint");
      expect(typeof result.totalWeiString).toBe("string");
      expect(typeof result.totalTokens).toBe("string");
      expect(typeof result.recipientCount).toBe("number");
      expect(typeof result.amountCount).toBe("number");
    });
  });
});

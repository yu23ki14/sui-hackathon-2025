import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

interface SupportFormProps {
  walletAddress: string | null;
  usdcBalance: number; // Note: This is now SUI balance, but kept name for compatibility
  onSubmit: (amount: number) => Promise<void>;
  isSubmitting: boolean;
}

export function SupportForm({
  walletAddress,
  usdcBalance, // Actually SUI balance
  onSubmit,
  isSubmitting,
}: SupportFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateAmount = (value: string): boolean => {
    setError("");

    if (!value || value === "0") {
      setError("金額を入力してください。");
      return false;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      setError("正しい数値を入力してください。");
      return false;
    }

    // Changed minimum from 1 USDC to 0.01 SUI for testing
    if (numValue < 0.01) {
      setError("0.01 SUI 以上の金額を入力してください。");
      return false;
    }

    if (numValue > usdcBalance) {
      setError("残高が不足しています。");
      return false;
    }

    return true;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setError("");
    }
  };

  const handleMaxClick = () => {
    const maxAmount = Math.floor(usdcBalance).toString();
    setAmount(maxAmount);
    validateAmount(maxAmount);
  };

  const handleSubmit = async () => {
    if (!validateAmount(amount)) {
      return;
    }

    try {
      await onSubmit(parseFloat(amount));
      setAmount("");
      setError("");
    } catch (err) {
      setError("トランザクションに失敗しました。");
    }
  };

  const isDisabled =
    !walletAddress || !amount || !!error || isSubmitting || parseFloat(amount) <= 0;

  return (
    <Card
      style={{
        padding: "24px",
        borderRadius: "12px",
        background: "#11151A",
      }}
    >
      {/* ラベル */}
      <Text
        size="3"
        style={{
          color: "var(--color-text-primary)",
          display: "block",
          marginBottom: "12px",
          fontWeight: "600",
        }}
      >
        サポート額（SUI）
      </Text>

      {/* 入力フィールド */}
      <Flex gap="2" mb="2">
        <Box style={{ flex: 1 }}>
          <TextField.Root
            type="number"
            placeholder="例）0.1"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            disabled={!walletAddress || isSubmitting}
            step="0.01"
            min="0.01"
            style={{
              width: "100%",
            }}
          />
        </Box>
        <Button
          variant="soft"
          onClick={handleMaxClick}
          disabled={!walletAddress || isSubmitting}
        >
          MAX
        </Button>
      </Flex>

      {/* エラー表示 */}
      {error && (
        <Text
          size="2"
          style={{
            color: "var(--color-accent)",
            display: "block",
            marginBottom: "12px",
          }}
        >
          {error}
        </Text>
      )}

      {/* 送信ボタン */}
      <Button
        size="3"
        style={{
          width: "100%",
          background: isDisabled
            ? "var(--color-border)"
            : "var(--color-primary)",
          color: "var(--color-text-primary)",
          cursor: isDisabled ? "not-allowed" : "pointer",
          marginTop: "16px",
        }}
        disabled={isDisabled}
        onClick={handleSubmit}
      >
        {isSubmitting ? "送信中..." : "Supportする"}
      </Button>
    </Card>
  );
}

import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

interface FeedbackAlertProps {
  type: "success" | "error";
  message: string;
  txHash?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

export function FeedbackAlert({
  type,
  message,
  txHash,
  onClose,
  onRetry,
}: FeedbackAlertProps) {
  const isSuccess = type === "success";

  return (
    <Card
      style={{
        padding: "32px",
        borderRadius: "12px",
        background: isSuccess ? "#0A4D2C" : "#4D0A0A",
        border: `2px solid ${isSuccess ? "#0A84FF" : "#E53935"}`,
        textAlign: "center",
      }}
    >
      <Heading
        size="5"
        mb="3"
        style={{
          color: isSuccess ? "#0A84FF" : "#E53935",
        }}
      >
        {isSuccess ? "✓ Supportが完了しました！" : "✗ エラーが発生しました"}
      </Heading>

      <Text
        size="3"
        style={{
          color: "var(--color-text-primary)",
          display: "block",
          lineHeight: "1.6",
          marginBottom: "24px",
        }}
      >
        {message}
      </Text>

      {isSuccess && txHash && (
        <Text
          size="1"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            marginBottom: "24px",
            fontFamily: "monospace",
          }}
        >
          Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </Text>
      )}

      <Flex gap="3" justify="center" wrap="wrap">
        {isSuccess ? (
          <>
            <Link to="/mypage" style={{ textDecoration: "none" }}>
              <Button
                size="3"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-text-primary)",
                }}
              >
                マイページで確認する
              </Button>
            </Link>
            <Button variant="soft" size="3" onClick={onClose}>
              さらにサポートする
            </Button>
          </>
        ) : (
          <>
            {onRetry && (
              <Button
                size="3"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-text-primary)",
                }}
                onClick={onRetry}
              >
                再試行する
              </Button>
            )}
            {onClose && (
              <Button variant="soft" size="3" onClick={onClose}>
                閉じる
              </Button>
            )}
          </>
        )}
      </Flex>
    </Card>
  );
}

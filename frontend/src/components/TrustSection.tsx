import { Box, Button, Text } from "@radix-ui/themes";

export function TrustSection() {
  return (
    <Box
      mt="6"
      mb="6"
      style={{
        textAlign: "center",
        padding: "32px",
      }}
    >
      <Text
        size="3"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          lineHeight: "1.7",
          marginBottom: "24px",
          maxWidth: "800px",
          margin: "0 auto 24px",
        }}
      >
        支援はすべてスマートコントラクトで管理され、
        「分配頻度・上限額・分配率」はオンチェーンで誰でも確認できます。
        選手・ジム・後援会、全員にとってフェアな仕組みです。
      </Text>

      <Button
        variant="soft"
        size="3"
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          // TODO: モーダル or ページ遷移
          alert("仕組みの詳細ページへ遷移します（未実装）");
        }}
      >
        仕組みを詳しく見る
      </Button>
    </Box>
  );
}

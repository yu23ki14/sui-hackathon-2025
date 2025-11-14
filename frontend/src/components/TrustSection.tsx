import { Box, Button, Text } from "@radix-ui/themes";
import { homePageConfig } from "../config";

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
        {homePageConfig.trust.description}
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
        {homePageConfig.trust.learnMoreButtonText}
      </Button>
    </Box>
  );
}

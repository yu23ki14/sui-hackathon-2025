import { Box, Grid, Heading, Text } from "@radix-ui/themes";

interface SummaryCardProps {
  label: string;
  value: string;
  subtitle: string;
}

function SummaryCard({ label, value, subtitle }: SummaryCardProps) {
  return (
    <Box
      style={{
        background: "#11151A",
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      <Text
        size="2"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
      <Heading size="6" mb="2" style={{ color: "var(--color-primary)" }}>
        {value}
      </Heading>
      <Text
        size="1"
        style={{ color: "var(--color-text-secondary)", display: "block" }}
      >
        {subtitle}
      </Text>
    </Box>
  );
}

interface MySummaryCardsProps {
  totalSupportAmount: number;
  nftCount: number;
  lastSupportDate: number | null;
  isLoading?: boolean;
}

export function MySummaryCards({
  totalSupportAmount,
  nftCount,
  lastSupportDate,
  isLoading,
}: MySummaryCardsProps) {
  const formatDate = (ms: number | null) => {
    if (!ms) return "--";
    const date = new Date(ms);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Grid columns={{ initial: "1", md: "3" }} gap="4">
        <SummaryCard label="累計サポート額" value="--" subtitle="読み込み中..." />
        <SummaryCard label="Members NFT" value="--" subtitle="読み込み中..." />
        <SummaryCard
          label="最後にサポートした日"
          value="--"
          subtitle="読み込み中..."
        />
      </Grid>
    );
  }

  return (
    <Grid columns={{ initial: "1", md: "3" }} gap="4">
      <SummaryCard
        label="累計サポート額"
        value={`${totalSupportAmount.toFixed(4)} SUI`}
        subtitle="これまでに TEAM KENTA に送った支援の合計です。"
      />
      <SummaryCard
        label="Members NFT"
        value={`${nftCount} 枚`}
        subtitle="支援するたびに NFT が増えていきます。"
      />
      <SummaryCard
        label="最後にサポートした日"
        value={formatDate(lastSupportDate)}
        subtitle="直近の Support トランザクション日時です。"
      />
    </Grid>
  );
}

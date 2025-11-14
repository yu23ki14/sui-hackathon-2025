import { Box, Grid, Heading, Text } from "@radix-ui/themes";

interface StatusCardProps {
  label: string;
  value: string;
  subtitle: string;
}

function StatusCard({ label, value, subtitle }: StatusCardProps) {
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
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Heading
        size="6"
        mb="2"
        style={{ color: "var(--color-text-primary)" }}
      >
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

interface StatusCardsProps {
  poolBalance: number;
  totalSupportAmount: number;
  supporterCount: number;
  nextAvailableTime: Date | null;
}

export function StatusCards({
  poolBalance,
  totalSupportAmount,
  supporterCount,
  nextAvailableTime,
}: StatusCardsProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("ja-JP", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "集計中...";
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
      timeZoneName: "short",
    });
  };

  return (
    <Box mt="6">
      <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
        <StatusCard
          label="POOL 残高"
          value={`${formatCurrency(poolBalance)} USDC`}
          subtitle="次回分配の対象となる残高"
        />
        <StatusCard
          label="累計サポート額"
          value={`${formatCurrency(totalSupportAmount)} USDC`}
          subtitle="これまでコミュニティから集まった支援"
        />
        <StatusCard
          label="サポーター数"
          value={`${supporterCount} 名`}
          subtitle="Members NFT を保有するウォレット数"
        />
        <StatusCard
          label="次回分配 実行可能"
          value={formatDateTime(nextAvailableTime)}
          subtitle="30日に1回、誰でも分配を実行できます"
        />
      </Grid>
    </Box>
  );
}

import { Box, Grid, Heading, Text } from "@radix-ui/themes";

interface DistributionCardProps {
  label: string;
  percentage: string;
  description: string;
}

function DistributionCard({
  label,
  percentage,
  description,
}: DistributionCardProps) {
  return (
    <Box
      style={{
        background: "#11151A",
        padding: "24px",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <Text
        size="3"
        style={{
          color: "var(--color-text-primary)",
          display: "block",
          marginBottom: "12px",
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
      <Heading
        size="8"
        mb="3"
        style={{ color: "var(--color-primary)" }}
      >
        {percentage}
      </Heading>
      <Text
        size="2"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          lineHeight: "1.5",
        }}
      >
        {description}
      </Text>
    </Box>
  );
}

interface DistributionSectionProps {
  fighterPercentage: number;
  gymPercentage: number;
  organizerPercentage: number;
}

export function DistributionSection({
  fighterPercentage,
  gymPercentage,
  organizerPercentage,
}: DistributionSectionProps) {
  return (
    <Box mt="6">
      <Heading size="6" mb="2">
        支援がどのように分配されるか
      </Heading>
      <Text
        size="2"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          marginBottom: "24px",
        }}
      >
        Support された USDC は、以下のルールで自動分配されます。
      </Text>

      <Grid columns={{ initial: "1", md: "3" }} gap="4">
        <DistributionCard
          label="Fighter"
          percentage={`${fighterPercentage}%`}
          description="トレーニング費用や生活費、遠征費に充てられます。"
        />
        <DistributionCard
          label="Gym"
          percentage={`${gymPercentage}%`}
          description="ジムの設備・若手育成のためにシェアされます。"
        />
        <DistributionCard
          label="Organizer"
          percentage={`${organizerPercentage}%`}
          description="後援会運営の持続性を担保するための報酬です。"
        />
      </Grid>
    </Box>
  );
}

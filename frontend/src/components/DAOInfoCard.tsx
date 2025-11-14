import { Box, Card, Heading, Text } from "@radix-ui/themes";

interface DAOInfoCardProps {
  name: string;
  description: string;
  fighterPercentage: number;
  gymPercentage: number;
  organizerPercentage: number;
}

export function DAOInfoCard({
  name,
  description,
  fighterPercentage,
  gymPercentage,
  organizerPercentage,
}: DAOInfoCardProps) {
  return (
    <Card
      style={{
        padding: "24px",
        borderRadius: "12px",
        background: "#11151A",
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
        サポート対象
      </Text>

      <Heading size="5" mb="3" style={{ color: "var(--color-text-primary)" }}>
        {name}
      </Heading>

      <Text
        size="2"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          lineHeight: "1.6",
          marginBottom: "16px",
        }}
      >
        {description}
      </Text>

      <Box
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "14px",
          color: "var(--color-text-secondary)",
        }}
      >
        <Text size="1">Fighter {fighterPercentage}%</Text>
        <Text size="1">Gym {gymPercentage}%</Text>
        <Text size="1">Organizer {organizerPercentage}%</Text>
      </Box>
    </Card>
  );
}

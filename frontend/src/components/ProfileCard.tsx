import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import { RankBadge } from "./RankBadge";

interface ProfileCardProps {
  walletAddress: string;
  nftCount: number;
  totalSupportAmount: number; // Total support amount in USDC
  onChangeWallet?: () => void;
}

export function ProfileCard({
  walletAddress,
  nftCount,
  totalSupportAmount,
  onChangeWallet,
}: ProfileCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card
      style={{
        padding: "24px",
        borderRadius: "12px",
        background: "#11151A",
      }}
    >
      <Flex
        direction={{ initial: "column", md: "row" }}
        justify="between"
        align={{ initial: "start", md: "center" }}
        gap="4"
      >
        {/* 左側：ウォレット情報 */}
        <Box style={{ flex: 1 }}>
          <Flex align="center" gap="2">
            <Box style={{ flex: 1 }}>
              <Text
                size="2"
                style={{
                  color: "var(--color-text-secondary)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                ウォレット
              </Text>
              <Text
                size="4"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "monospace",
                  fontWeight: "600",
                }}
              >
                {formatAddress(walletAddress)}
              </Text>
            </Box>
            {onChangeWallet && (
              <Button variant="ghost" size="1" onClick={onChangeWallet}>
                接続変更
              </Button>
            )}
          </Flex>
        </Box>

        {/* 右側：ランク */}
        <Box>
          <RankBadge totalSupportAmount={totalSupportAmount} />
        </Box>
      </Flex>
    </Card>
  );
}

import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { getRank, Rank } from "./RankBadge";

interface AuthStatusBarProps {
  walletAddress: string | null;
  nftCount: number;
  isAuthenticated: boolean;
  onAuthenticate?: () => void;
}

export function AuthStatusBar({
  walletAddress,
  nftCount,
  isAuthenticated,
  onAuthenticate,
}: AuthStatusBarProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const rank = getRank(nftCount);

  const rankColors: Record<Rank, string> = {
    Gold: "#FFD700",
    Silver: "#B0BEC5",
    Bronze: "#CD7F32",
    None: "#2A2F34",
  };

  // ウォレット未接続時
  if (!walletAddress) {
    return (
      <Card
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "#11151A",
          border: "2px solid var(--color-border)",
        }}
      >
        <Flex direction={{ initial: "column", sm: "row" }} gap="3" align="center" justify="center">
          <Text
            size="3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ウォレットが接続されていません
          </Text>
          <ConnectButton />
        </Flex>
      </Card>
    );
  }

  return (
    <Card
      style={{
        padding: "24px",
        borderRadius: "12px",
        background: "#11151A",
        border: isAuthenticated
          ? "2px solid var(--color-primary)"
          : "2px solid var(--color-border)",
      }}
    >
      <Flex
        direction={{ initial: "column", md: "row" }}
        gap="4"
        align="center"
        justify="between"
      >
        {/* 左側：ウォレット＋NFT情報 */}
        <Flex gap="4" align="center" wrap="wrap">
          {/* ウォレットアドレス */}
          <Box>
            <Text
              size="1"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              ウォレット
            </Text>
            <Text
              size="3"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "monospace",
                fontWeight: "600",
              }}
            >
              {formatAddress(walletAddress)}
            </Text>
          </Box>

          {/* NFT枚数 */}
          <Box>
            <Text
              size="1"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Members NFT
            </Text>
            <Text
              size="3"
              style={{
                color: "var(--color-text-primary)",
                fontWeight: "600",
              }}
            >
              {nftCount} 枚
            </Text>
          </Box>

          {/* ランク */}
          <Box>
            <Text
              size="1"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              ランク
            </Text>
            <Box
              style={{
                display: "inline-block",
                background: rankColors[rank],
                color: "#1A1A1A",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {rank}
            </Box>
          </Box>
        </Flex>

        {/* 右側：認証ボタン */}
        <Box>
          {isAuthenticated ? (
            <Flex align="center" gap="2">
              <Text
                size="3"
                style={{
                  color: "var(--color-primary)",
                  fontWeight: "600",
                }}
              >
                認証済み ✅
              </Text>
              {onAuthenticate && (
                <Button variant="soft" size="2" onClick={onAuthenticate}>
                  再認証
                </Button>
              )}
            </Flex>
          ) : (
            <Button
              size="3"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-text-primary)",
              }}
              onClick={onAuthenticate}
            >
              ウォレットで認証・アンロック
            </Button>
          )}
        </Box>
      </Flex>
    </Card>
  );
}

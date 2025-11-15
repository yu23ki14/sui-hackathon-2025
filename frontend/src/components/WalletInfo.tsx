import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";

interface WalletInfoProps {
  walletAddress: string | null;
  usdcBalance: number; // Note: This is now SUI balance, but kept name for compatibility
  onChangeWallet?: () => void;
}

export function WalletInfo({
  walletAddress,
  usdcBalance, // Actually SUI balance
  onChangeWallet,
}: WalletInfoProps) {
  if (!walletAddress) {
    return (
      <Card
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "#11151A",
          textAlign: "center",
        }}
      >
        <Text
          size="3"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            marginBottom: "16px",
          }}
        >
          ウォレットが接続されていません
        </Text>
        <ConnectButton />
      </Card>
    );
  }

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
      {/* ウォレット情報 */}
      <Flex justify="between" align="center" mb="3">
        <Box>
          <Text
            size="2"
            style={{
              color: "var(--color-text-secondary)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            接続中ウォレット
          </Text>
          <Text
            size="3"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "monospace",
            }}
          >
            {formatAddress(walletAddress)}
          </Text>
        </Box>
        {onChangeWallet && (
          <Button variant="ghost" size="1" onClick={onChangeWallet}>
            変更
          </Button>
        )}
      </Flex>

      {/* 残高情報 */}
      <Box mb="2">
        <Text
          size="2"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            marginBottom: "4px",
          }}
        >
          SUI 残高
        </Text>
        <Text
          size="4"
          style={{
            color: "var(--color-text-primary)",
            fontWeight: "600",
          }}
        >
          {usdcBalance.toFixed(4)} SUI
        </Text>
      </Box>

      {/* 補足テキスト */}
      <Text
        size="1"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          lineHeight: "1.5",
        }}
      >
        ※ サポートには SUI を使用します。ガス代も SUI から差し引かれます。
      </Text>
    </Card>
  );
}

import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

interface AdminInfoBarProps {
  walletAddress: string | null;
  isAdmin: boolean;
}

export function AdminInfoBar({ walletAddress, isAdmin }: AdminInfoBarProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box mb="6">
      <Heading size="8" mb="3">
        Admin Panel / 分配管理
      </Heading>
      <Text
        size="3"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          lineHeight: "1.7",
          marginBottom: "24px",
        }}
      >
        分配ルールの設定と、分配トランザクションの実行・履歴確認を行う画面です。
      </Text>

      <Card
        style={{
          padding: "20px 24px",
          borderRadius: "12px",
          background: "#11151A",
          border: isAdmin
            ? "2px solid var(--color-primary)"
            : "2px solid var(--color-border)",
        }}
      >
        <Flex
          direction={{ initial: "column", sm: "row" }}
          gap="4"
          align="center"
          justify="between"
        >
          {/* 左側：ウォレット情報 */}
          <Flex gap="4" align="center" wrap="wrap">
            <Box>
              <Text
                size="1"
                style={{
                  color: "var(--color-text-secondary)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                接続中ウォレット
              </Text>
              {walletAddress ? (
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
              ) : (
                <Text size="3" style={{ color: "var(--color-text-secondary)" }}>
                  未接続
                </Text>
              )}
            </Box>

            {/* 権限表示 */}
            <Box>
              <Text
                size="1"
                style={{
                  color: "var(--color-text-secondary)",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                権限
              </Text>
              {isAdmin ? (
                <Box
                  style={{
                    display: "inline-block",
                    background: "var(--color-primary)",
                    color: "var(--color-text-primary)",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Admin ✅
                </Box>
              ) : (
                <Box
                  style={{
                    display: "inline-block",
                    background: "var(--color-border)",
                    color: "var(--color-text-secondary)",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  閲覧のみ
                </Box>
              )}
            </Box>
          </Flex>

          {/* 右側：注意書き */}
          {!isAdmin && walletAddress && (
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                textAlign: "right",
              }}
            >
              ※ 分配実行・設定変更は Admin のみ可能です
            </Text>
          )}
        </Flex>
      </Card>
    </Box>
  );
}

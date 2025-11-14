import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <Card
      style={{
        marginTop: "32px",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Flex
        direction={{ initial: "column", md: "row" }}
        gap="4"
        align="stretch"
      >
        {/* 左カラム：テキスト情報 */}
        <Box style={{ flex: 1 }}>
          {/* ラベル */}
          <Box
            style={{
              display: "inline-block",
              background: "var(--color-primary)",
              color: "var(--color-text-primary)",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            TEAM KENTA DAO
          </Box>

          {/* ファイター名 */}
          <Heading size="8" mb="2">
            KENTA TAKAHASHI
          </Heading>
          <Text
            size="3"
            style={{ color: "var(--color-text-secondary)", display: "block" }}
            mb="4"
          >
            Bantamweight / STRONG Gym
          </Text>

          {/* ジム名・幹事名 */}
          <Box mb="4">
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              🥋 所属ジム：STRONG Gym
            </Text>
            <Text
              size="2"
              style={{ color: "var(--color-text-secondary)", display: "block" }}
            >
              👥 幹事：後援会 TEAM ARENA
            </Text>
          </Box>

          {/* 短い一言コピー */}
          <Text
            size="3"
            style={{
              color: "var(--color-text-secondary)",
              display: "block",
              lineHeight: "1.6",
            }}
            mb="5"
          >
            ONE を目指すファイターを、コミュニティで継続的に支える後援会DAOです。
          </Text>

          {/* メインCTAボタン */}
          <Box>
            <Link to="/support" style={{ textDecoration: "none" }}>
              <Button
                size="3"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-text-primary)",
                  width: "220px",
                  cursor: "pointer",
                }}
              >
                今すぐ Support する
              </Button>
            </Link>
            <Text
              size="1"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginTop: "8px",
              }}
            >
              USDC で支援 / Web3 ウォレット対応
            </Text>
          </Box>
        </Box>

        {/* 右カラム：ビジュアル */}
        <Box
          style={{
            flex: 1,
            background: "var(--color-border)",
            borderRadius: "8px",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            size="2"
            style={{ color: "var(--color-text-secondary)", textAlign: "center" }}
          >
            ファイター画像
            <br />
            (16:9)
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}

import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { siteConfig, fighterInfo, homePageConfig } from "../config";

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
            {siteConfig.daoName}
          </Box>

          {/* ファイター名 */}
          <Heading size="8" mb="2">
            {fighterInfo.name}
          </Heading>
          <Text
            size="3"
            style={{ color: "var(--color-text-secondary)", display: "block" }}
            mb="4"
          >
            {fighterInfo.weightClass} / {fighterInfo.gym}
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
              🥋 所属ジム：{fighterInfo.gym}
            </Text>
            <Text
              size="2"
              style={{ color: "var(--color-text-secondary)", display: "block" }}
            >
              👥 幹事：{fighterInfo.organizer}
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
            {homePageConfig.hero.catchphrase}
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
                {homePageConfig.hero.ctaButtonText}
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
              {homePageConfig.hero.ctaSubtext}
            </Text>
          </Box>
        </Box>

        {/* 右カラム：ビジュアル */}
        <Box
          style={{
            flex: 1,
            background: fighterInfo.imageUrl
              ? `url(${fighterInfo.imageUrl}) center/cover`
              : "var(--color-border)",
            borderRadius: "8px",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!fighterInfo.imageUrl && (
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                textAlign: "center",
              }}
            >
              ファイター画像
              <br />
              (16:9)
            </Text>
          )}
        </Box>
      </Flex>
    </Card>
  );
}

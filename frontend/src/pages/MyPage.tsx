import { Box, Button, Container, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { ProfileCard } from "../components/ProfileCard";
import { MySummaryCards } from "../components/MySummaryCards";
import { SupportHistoryTable } from "../components/SupportHistoryTable";
import { ConnectButton } from "@mysten/dapp-kit";
import { useWalletConnection, useUserNftData, useSupportHistory } from "../hooks";
import { myPageConfig, siteConfig } from "../config";

export default function MyPage() {
  const { walletAddress } = useWalletConnection();
  const {
    nftCount,
    totalSupportAmount,
    isLoading: isLoadingNftData,
  } = useUserNftData();
  const {
    history: supportHistory,
    lastSupportDate,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useSupportHistory();

  const isLoading = isLoadingNftData || isLoadingHistory;

  // ウォレット未接続時
  if (!walletAddress) {
    return (
      <Container size="3">
        <Box
          style={{
            textAlign: "center",
            padding: "64px 32px",
          }}
        >
          <Heading size="7" mb="4">
            {myPageConfig.walletNotConnectedMessage}
          </Heading>
          <Text
            size="3"
            style={{
              color: "var(--color-text-secondary)",
              display: "block",
              marginBottom: "32px",
            }}
          >
            ウォレットを接続して、あなたのサポート履歴を確認しましょう。
          </Text>
          <ConnectButton />
        </Box>
      </Container>
    );
  }

  return (
    <Container size="4">
      {/* タイトル＆説明 */}
      <Box mb="6">
        <Heading size="8" mb="3">
          {myPageConfig.title}
        </Heading>
        <Text
          size="3"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            lineHeight: "1.7",
          }}
        >
          {myPageConfig.description}
        </Text>
      </Box>

      {/* プロフィールエリア */}
      <Box mb="4">
        <ProfileCard
          walletAddress={walletAddress}
          nftCount={nftCount}
          totalSupportAmount={totalSupportAmount}
        />
      </Box>

      {/* サマリカード */}
      <Box mb="6">
        <MySummaryCards
          totalSupportAmount={totalSupportAmount}
          nftCount={nftCount}
          lastSupportDate={lastSupportDate}
          isLoading={isLoading}
        />
      </Box>

      {/* サポート履歴テーブル */}
      <Box mb="6">
        <Heading size="5" mb="4">
          {myPageConfig.supportHistory.title}
        </Heading>
        <SupportHistoryTable
          history={supportHistory}
          isLoading={isLoading}
          errorMessage={historyError?.message || null}
        />
      </Box>

      {/* 再サポートへの導線 */}
      {supportHistory.length > 0 && (
        <Box
          mb="6"
          style={{
            textAlign: "center",
            padding: "32px",
            background: "#11151A",
            borderRadius: "12px",
          }}
        >
          <Text
            size="4"
            style={{
              color: "var(--color-text-primary)",
              display: "block",
              marginBottom: "24px",
              fontWeight: "600",
            }}
          >
            {myPageConfig.footer.message}
          </Text>
          <Link to="/support" style={{ textDecoration: "none" }}>
            <Button
              size="3"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-text-primary)",
              }}
            >
              {myPageConfig.footer.ctaButtonText}
            </Button>
          </Link>
        </Box>
      )}
    </Container>
  );
}


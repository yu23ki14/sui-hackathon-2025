import { Box, Button, Container, Grid, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthStatusBar } from "../components/AuthStatusBar";
import { ContentCard, ContentItem } from "../components/ContentCard";
import { ContentDetailModal } from "../components/ContentDetailModal";
import { LockedContentModal } from "../components/LockedContentModal";
import { useWalletConnection, useUserNftData, useContentAccess } from "../hooks";
import { exclusiveContentConfig } from "../config";

export default function ExclusiveContent() {
  const { walletAddress } = useWalletConnection();
  const { nftCount } = useUserNftData();
  const { authenticate, isAuthenticated } = useContentAccess();
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  const handleAuthenticate = async () => {
    await authenticate();
  };

  const handleContentClick = (content: ContentItem) => {
    setSelectedContent(content);
    if (nftCount >= content.requiredNft) {
      // アンロック済み → 詳細モーダルを開く
      setIsDetailModalOpen(true);
    } else {
      // ロック中 → ロックモーダルを開く
      setIsLockedModalOpen(true);
    }
  };

  return (
    <Container size="4">
      {/* タイトル＆説明 */}
      <Box mb="6" style={{ textAlign: "center" }}>
        <Heading size="8" mb="3">
          {exclusiveContentConfig.title}
        </Heading>
        <Text
          size="3"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            lineHeight: "1.7",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {exclusiveContentConfig.description}
        </Text>
      </Box>

      {/* 認証ステータスバー */}
      <Box mb="6">
        <AuthStatusBar
          walletAddress={walletAddress}
          nftCount={nftCount}
          isAuthenticated={isAuthenticated}
          onAuthenticate={handleAuthenticate}
        />
      </Box>

      {/* コンテンツ一覧 */}
      <Box mb="6">
        <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
          {exclusiveContentConfig.contentItems.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              nftCount={walletAddress ? nftCount : 0}
              onClick={() => handleContentClick(content)}
            />
          ))}
        </Grid>
      </Box>

      {/* ページ下部の説明・導線 */}
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
          size="3"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            marginBottom: "24px",
            lineHeight: "1.7",
          }}
        >
          {exclusiveContentConfig.footer.description}
        </Text>
        <Link to="/support" style={{ textDecoration: "none" }}>
          <Button
            size="3"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-text-primary)",
            }}
          >
            {exclusiveContentConfig.footer.ctaButtonText}
          </Button>
        </Link>
      </Box>

      {/* コンテンツ詳細モーダル（アンロック済み） */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContent(null);
        }}
      />

      {/* ロックコンテンツモーダル */}
      <LockedContentModal
        content={selectedContent}
        nftCount={nftCount}
        isOpen={isLockedModalOpen}
        onClose={() => {
          setIsLockedModalOpen(false);
          setSelectedContent(null);
        }}
      />
    </Container>
  );
}


import { Box, Button, Container, Grid, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthStatusBar } from "../components/AuthStatusBar";
import { ContentCard, ContentItem } from "../components/ContentCard";
import { ContentDetailModal } from "../components/ContentDetailModal";
import { LockedContentModal } from "../components/LockedContentModal";
import { useWalletConnection, useUserNftData, useContentAccess } from "../hooks";

// モックコンテンツデータ
const CONTENT_LIST: ContentItem[] = [
  {
    id: "1",
    title: "試合当日のロッカールーム映像",
    description: "ONE 本戦前のロッカールームでの準備をメンバーだけに公開。",
    type: "video",
    requiredNft: 10,
    content: "https://example.com/video1.mp4",
  },
  {
    id: "2",
    title: "KENTAからの月1ボイスメッセージ",
    description: "近況報告と次の試合への意気込み。",
    type: "text",
    requiredNft: 5,
    content:
      "皆さん、いつも応援ありがとうございます！\n\n今月は新しいトレーニングメニューを取り入れて、パンチの切れ味を上げることに集中しています。次の試合では必ず勝利を掴み取ります。\n\nこれからも応援よろしくお願いします！\n\nKENTA",
  },
  {
    id: "3",
    title: "観戦チケット 10%OFF コード",
    description: "次回イベントのチケット割引コード。先着順。",
    type: "code",
    requiredNft: 1,
    content: "TEAMKENTA10",
  },
  {
    id: "4",
    title: "試合前日のミット打ち動画",
    description: "試合前日の調整スパーをノーカットでお届けします。",
    type: "video",
    requiredNft: 5,
    content: "https://example.com/video2.mp4",
  },
  {
    id: "5",
    title: "Gold メンバー限定トークセッション",
    description: "月1回の質問コーナー。KENTAが直接答えます。",
    type: "audio",
    requiredNft: 10,
    content: "audio_session_01.mp3",
  },
  {
    id: "6",
    title: "オフィシャルグッズ 20%OFF コード",
    description: "TEAM KENTA オフィシャルグッズの割引コード。",
    type: "code",
    requiredNft: 5,
    content: "TEAMGOODS20",
  },
];

export default function ExclusiveContent() {
  const { walletAddress } = useWalletConnection();
  const { nftCount } = useUserNftData();
  const { authenticate, isAuthenticated, isAuthenticating } = useContentAccess();
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
          TEAM KENTA メンバー限定コンテンツ
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
          Members NFT の保有枚数に応じて、ここだけのコンテンツにアクセスできます。
          <br />
          Gold メンバー（NFT 10枚以上）は、動画やチケット割引コードもアンロックされます。
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
          {CONTENT_LIST.map((content) => (
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
          Members NFT は、Support するたびに 1 枚ずつ増えていきます。
          <br />
          NFT の枚数に応じて、見られるコンテンツや特典が増えていきます。
        </Text>
        <Link to="/support" style={{ textDecoration: "none" }}>
          <Button
            size="3"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-text-primary)",
            }}
          >
            Supportして NFT を増やす
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


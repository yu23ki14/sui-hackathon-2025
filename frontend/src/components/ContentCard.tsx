import { Box, Card, Heading, Text } from "@radix-ui/themes";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "audio" | "code";
  requiredNft: number;
  thumbnailUrl?: string;
  content?: string;
}

interface ContentCardProps {
  content: ContentItem;
  nftCount: number;
  onClick: () => void;
}

const typeLabels = {
  video: "動画",
  text: "テキスト",
  audio: "音声",
  code: "クーポンコード",
};

const typeIcons = {
  video: "🎬",
  text: "📝",
  audio: "🎙️",
  code: "🎟️",
};

const rankLabels: Record<number, string> = {
  1: "Bronze 以上",
  5: "Silver 以上",
  10: "Gold 限定",
};

export function ContentCard({ content, nftCount, onClick }: ContentCardProps) {
  const isUnlocked = nftCount >= content.requiredNft;

  return (
    <Card
      style={{
        position: "relative",
        padding: "0",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: isUnlocked
          ? "2px solid var(--color-primary)"
          : "2px solid var(--color-border)",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* サムネイル */}
      <Box
        style={{
          position: "relative",
          height: "180px",
          background: content.thumbnailUrl
            ? `url(${content.thumbnailUrl}) center/cover`
            : "linear-gradient(135deg, #2A2F34 0%, #1A1F24 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!content.thumbnailUrl && (
          <Text style={{ fontSize: "48px" }}>{typeIcons[content.type]}</Text>
        )}

        {/* ロック時のオーバーレイ */}
        {!isUnlocked && (
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Text style={{ fontSize: "32px" }}>🔒</Text>
            <Text
              size="2"
              style={{
                color: "var(--color-text-primary)",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              ロックされています
            </Text>
          </Box>
        )}

        {/* アクセス条件ラベル */}
        <Box
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: isUnlocked
              ? "var(--color-primary)"
              : "rgba(42, 47, 52, 0.9)",
            color: "var(--color-text-primary)",
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {rankLabels[content.requiredNft] || `NFT ${content.requiredNft}枚〜`}
        </Box>
      </Box>

      {/* コンテンツ情報 */}
      <Box style={{ padding: "16px" }}>
        {/* タイプラベル */}
        <Text
          size="1"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          {typeLabels[content.type]}
        </Text>

        {/* タイトル */}
        <Heading
          size="4"
          mb="2"
          style={{
            color: "var(--color-text-primary)",
            lineHeight: "1.3",
          }}
        >
          {content.title}
        </Heading>

        {/* 説明 */}
        <Text
          size="2"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            lineHeight: "1.5",
            marginBottom: "12px",
          }}
        >
          {content.description}
        </Text>

        {/* ステータス */}
        <Text
          size="2"
          style={{
            color: isUnlocked ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontWeight: "600",
          }}
        >
          {isUnlocked ? "✅ 視聴可能です" : "🔒 アンロックが必要です"}
        </Text>
      </Box>
    </Card>
  );
}

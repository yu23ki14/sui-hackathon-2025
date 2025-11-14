import { Box, Button, Dialog, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { ContentItem } from "./ContentCard";

interface LockedContentModalProps {
  content: ContentItem | null;
  nftCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const rankLabels: Record<number, string> = {
  1: "Bronze メンバー",
  5: "Silver メンバー",
  10: "Gold メンバー",
};

export function LockedContentModal({
  content,
  nftCount,
  isOpen,
  onClose,
}: LockedContentModalProps) {
  if (!content) return null;

  const requiredCount = content.requiredNft - nftCount;
  const rankLabel = rankLabels[content.requiredNft] || "メンバー";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content style={{ maxWidth: "500px" }}>
        <Box style={{ textAlign: "center" }}>
          {/* ロックアイコン */}
          <Box mb="4">
            <Text style={{ fontSize: "64px" }}>🔒</Text>
          </Box>

          <Dialog.Title>
            <Heading size="6" mb="3">
              このコンテンツはロックされています
            </Heading>
          </Dialog.Title>

          <Dialog.Description>
            <Box mb="4">
              <Text
                size="3"
                style={{
                  color: "var(--color-text-secondary)",
                  display: "block",
                  lineHeight: "1.7",
                }}
              >
                <strong style={{ color: "var(--color-text-primary)" }}>
                  {content.title}
                </strong>
                <br />
                を視聴するには、Members NFT を{" "}
                <strong style={{ color: "var(--color-primary)" }}>
                  {content.requiredNft} 枚以上
                </strong>
                保有している必要があります。
              </Text>
            </Box>

            {/* 現在の状態 */}
            <Box
              mb="4"
              style={{
                background: "#11151A",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
              }}
            >
              <Text
                size="2"
                style={{
                  color: "var(--color-text-secondary)",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                現在の保有枚数
              </Text>
              <Text
                size="6"
                style={{
                  color: "var(--color-text-primary)",
                  fontWeight: "700",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                {nftCount} 枚
              </Text>
              <Text
                size="2"
                style={{ color: "var(--color-accent)", fontWeight: "600" }}
              >
                あと {requiredCount} 枚で {rankLabel} にランクアップ！
              </Text>
            </Box>

            {/* アンロック方法 */}
            <Box
              mb="4"
              style={{
                background: "rgba(10, 132, 255, 0.1)",
                border: "1px solid var(--color-primary)",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <Text
                size="2"
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.6",
                }}
              >
                💡 Members NFT は、Support するたびに 1 枚ずつ増えていきます。
                <br />
                NFT を増やして、このコンテンツをアンロックしましょう！
              </Text>
            </Box>

            {/* アクションボタン */}
            <Box style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/support" style={{ textDecoration: "none", flex: 1 }}>
                <Button
                  size="3"
                  style={{
                    width: "100%",
                    background: "var(--color-primary)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Supportして NFT を増やす
                </Button>
              </Link>
              <Dialog.Close>
                <Button variant="soft" size="3">
                  閉じる
                </Button>
              </Dialog.Close>
            </Box>
          </Dialog.Description>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}

import { Box, Button, Dialog, Heading, Text } from "@radix-ui/themes";
import { ContentItem } from "./ContentCard";
import { useState } from "react";

interface ContentDetailModalProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContentDetailModal({
  content,
  isOpen,
  onClose,
}: ContentDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const handleCopyCode = () => {
    if (content.content) {
      navigator.clipboard.writeText(content.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content style={{ maxWidth: "600px" }}>
        <Dialog.Title>
          <Heading size="6" mb="2">
            {content.title}
          </Heading>
        </Dialog.Title>

        <Dialog.Description>
          <Box mb="4">
            <Text
              size="2"
              style={{ color: "var(--color-text-secondary)", display: "block" }}
            >
              {content.description}
            </Text>
          </Box>

          {/* コンテンツ種類に応じた表示 */}
          <Box
            mb="4"
            style={{
              background: "#11151A",
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            {content.type === "video" && (
              <Box>
                {content.content ? (
                  <Box
                    style={{
                      aspectRatio: "16/9",
                      background: "#000",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#666" }}>
                      動画プレイヤー（{content.content}）
                    </Text>
                  </Box>
                ) : (
                  <Text size="2" style={{ color: "var(--color-text-secondary)" }}>
                    動画URLが設定されていません
                  </Text>
                )}
              </Box>
            )}

            {content.type === "text" && (
              <Box>
                <Text
                  size="3"
                  style={{
                    color: "var(--color-text-primary)",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {content.content ||
                    "KENTAです。今月も皆さんの応援のおかげで充実したトレーニングができています。次の試合に向けて全力で準備しています！"}
                </Text>
              </Box>
            )}

            {content.type === "audio" && (
              <Box>
                {content.content ? (
                  <Box
                    style={{
                      padding: "24px",
                      textAlign: "center",
                    }}
                  >
                    <Text style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>
                      🎙️
                    </Text>
                    <Text size="2" style={{ color: "var(--color-text-secondary)" }}>
                      音声ファイル: {content.content}
                    </Text>
                  </Box>
                ) : (
                  <Text size="2" style={{ color: "var(--color-text-secondary)" }}>
                    音声ファイルが設定されていません
                  </Text>
                )}
              </Box>
            )}

            {content.type === "code" && (
              <Box>
                <Text
                  size="2"
                  style={{
                    color: "var(--color-text-secondary)",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  以下のコードをチケット購入時にご利用ください：
                </Text>
                <Box
                  style={{
                    background: "#0B0E11",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    marginBottom: "12px",
                  }}
                >
                  <Text
                    size="5"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "monospace",
                      fontWeight: "700",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {content.content || "TEAMKENTA10"}
                  </Text>
                </Box>
                <Button
                  variant="soft"
                  style={{ width: "100%" }}
                  onClick={handleCopyCode}
                >
                  {copied ? "コピーしました ✓" : "コードをコピー"}
                </Button>
              </Box>
            )}

            {content.type === "image" && (
              <Box>
                {content.content ? (
                  <Box
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={content.content}
                      alt={content.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                ) : (
                  <Text size="2" style={{ color: "var(--color-text-secondary)" }}>
                    画像URLが設定されていません
                  </Text>
                )}
              </Box>
            )}
          </Box>

          {/* 注意書き */}
          <Box
            style={{
              background: "rgba(10, 132, 255, 0.1)",
              border: "1px solid var(--color-primary)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <Text
              size="1"
              style={{ color: "var(--color-text-secondary)", lineHeight: "1.5" }}
            >
              💡 このコンテンツは Members NFT の保有条件を満たしたウォレットでのみ表示されます。
            </Text>
          </Box>
        </Dialog.Description>

        <Box mt="4" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Dialog.Close>
            <Button variant="soft">閉じる</Button>
          </Dialog.Close>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}

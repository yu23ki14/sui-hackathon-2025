import { Box, Button, Card, Heading, Table, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export interface SupportHistoryItem {
  date: string;
  amount: number;
  txHash: string;
}

interface SupportHistoryTableProps {
  history: SupportHistoryItem[];
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function SupportHistoryTable({
  history,
  isLoading,
  errorMessage,
}: SupportHistoryTableProps) {
  // エラー時
  if (errorMessage) {
    return (
      <Card
        style={{
          padding: "32px",
          borderRadius: "12px",
          background: "#11151A",
          textAlign: "center",
        }}
      >
        <Text
          size="3"
          style={{
            color: "var(--color-accent)",
            display: "block",
            marginBottom: "8px",
          }}
        >
          履歴の取得に失敗しました
        </Text>
        <Text
          size="2"
          style={{ color: "var(--color-text-secondary)", display: "block" }}
        >
          時間をおいて再度お試しください。
        </Text>
      </Card>
    );
  }

  // ローディング中
  if (isLoading) {
    return (
      <Card
        style={{
          padding: "32px",
          borderRadius: "12px",
          background: "#11151A",
          textAlign: "center",
        }}
      >
        <Text size="3" style={{ color: "var(--color-text-secondary)" }}>
          履歴を読み込み中...
        </Text>
      </Card>
    );
  }

  // 履歴が空の場合
  if (history.length === 0) {
    return (
      <Card
        style={{
          padding: "32px",
          borderRadius: "12px",
          background: "#11151A",
          textAlign: "center",
        }}
      >
        <Heading size="5" mb="3" style={{ color: "var(--color-text-primary)" }}>
          まだサポートはありません
        </Heading>
        <Text
          size="3"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            marginBottom: "24px",
          }}
        >
          最初の一歩を踏み出してみませんか？
        </Text>
        <Link to="/support" style={{ textDecoration: "none" }}>
          <Button
            size="3"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-text-primary)",
            }}
          >
            今すぐSupportする
          </Button>
        </Link>
      </Card>
    );
  }

  // デスクトップ：テーブル表示
  const DesktopTable = () => (
    <Box
      style={{
        display: "none",
      }}
      className="desktop-table"
    >
      <Table.Root
        variant="surface"
        style={{
          background: "#11151A",
          borderRadius: "12px",
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>日時</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>サポート額 (USDC)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tx</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {history.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.date}</Table.Cell>
              <Table.Cell>{item.amount.toFixed(2)}</Table.Cell>
              <Table.Cell>
                <a
                  href={`https://suiscan.xyz/testnet/tx/${item.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                  }}
                >
                  View
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );

  // モバイル：カード表示
  const MobileCards = () => (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      className="mobile-cards"
    >
      {history.map((item, index) => (
        <Card
          key={index}
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#11151A",
          }}
        >
          <Text
            size="2"
            style={{
              color: "var(--color-text-secondary)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            {item.date}
          </Text>
          <Text
            size="4"
            style={{
              color: "var(--color-text-primary)",
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            {item.amount.toFixed(2)} USDC
          </Text>
          <a
            href={`https://suiscan.xyz/testnet/tx/${item.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-primary)",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            View Tx
          </a>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box>
      <style>{`
        @media (min-width: 768px) {
          .desktop-table {
            display: block !important;
          }
          .mobile-cards {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-table {
            display: none !important;
          }
          .mobile-cards {
            display: flex !important;
          }
        }
      `}</style>
      <DesktopTable />
      <MobileCards />
    </Box>
  );
}

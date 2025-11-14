import { Box, Card, Heading, Table, Tabs, Text } from "@radix-ui/themes";

export interface SupportEvent {
  date: string;
  supporter: string;
  amount: number;
  txHash: string;
}

export interface DistributeEvent {
  date: string;
  totalAmount: number;
  fighterAmount: number;
  gymAmount: number;
  organizerAmount: number;
  txHash: string;
}

export interface BonusEvent {
  date: string;
  bonusAmount: number;
  fighterAmount: number;
  gymAmount: number;
  organizerAmount: number;
  txHash: string;
}

interface EventHistoryTabsProps {
  supportEvents: SupportEvent[];
  distributeEvents: DistributeEvent[];
  bonusEvents: BonusEvent[];
  isLoading?: boolean;
}

export function EventHistoryTabs({
  supportEvents,
  distributeEvents,
  bonusEvents,
  isLoading,
}: EventHistoryTabsProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const EmptyState = ({ message }: { message: string }) => (
    <Box style={{ textAlign: "center", padding: "32px" }}>
      <Text size="3" style={{ color: "var(--color-text-secondary)" }}>
        {message}
      </Text>
    </Box>
  );

  const LoadingState = () => (
    <Box style={{ textAlign: "center", padding: "32px" }}>
      <Text size="3" style={{ color: "var(--color-text-secondary)" }}>
        読み込み中...
      </Text>
    </Box>
  );

  return (
    <Box>
      <Heading size="5" mb="4">
        イベント履歴
      </Heading>

      <Card
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "#11151A",
        }}
      >
        <Tabs.Root defaultValue="support">
          <Tabs.List>
            <Tabs.Trigger value="support">
              Support ({supportEvents.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="distribute">
              Distribute ({distributeEvents.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="bonus">
              Bonus ({bonusEvents.length})
            </Tabs.Trigger>
          </Tabs.List>

          {/* Support イベント */}
          <Tabs.Content value="support">
            <Box mt="4">
              {isLoading ? (
                <LoadingState />
              ) : supportEvents.length === 0 ? (
                <EmptyState message="まだこの種類のイベントはありません。" />
              ) : (
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>日時</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>支援者</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>金額 (USDC)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Tx</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {supportEvents.map((event, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{event.date}</Table.Cell>
                        <Table.Cell style={{ fontFamily: "monospace" }}>
                          {formatAddress(event.supporter)}
                        </Table.Cell>
                        <Table.Cell>{event.amount.toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          <a
                            href={`https://suiscan.xyz/testnet/tx/${event.txHash}`}
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
              )}
            </Box>
          </Tabs.Content>

          {/* Distribute イベント */}
          <Tabs.Content value="distribute">
            <Box mt="4">
              {isLoading ? (
                <LoadingState />
              ) : distributeEvents.length === 0 ? (
                <EmptyState message="まだこの種類のイベントはありません。" />
              ) : (
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>日時</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>分配額合計</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Fighter</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Gym</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Organizer</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Tx</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {distributeEvents.map((event, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{event.date}</Table.Cell>
                        <Table.Cell>{event.totalAmount.toFixed(2)} USDC</Table.Cell>
                        <Table.Cell>{event.fighterAmount.toFixed(2)}</Table.Cell>
                        <Table.Cell>{event.gymAmount.toFixed(2)}</Table.Cell>
                        <Table.Cell>{event.organizerAmount.toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          <a
                            href={`https://suiscan.xyz/testnet/tx/${event.txHash}`}
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
              )}
            </Box>
          </Tabs.Content>

          {/* Bonus イベント */}
          <Tabs.Content value="bonus">
            <Box mt="4">
              {isLoading ? (
                <LoadingState />
              ) : bonusEvents.length === 0 ? (
                <EmptyState message="まだこの種類のイベントはありません。" />
              ) : (
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>日時</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>ボーナス額</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Fighter</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Gym</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Organizer</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Tx</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {bonusEvents.map((event, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{event.date}</Table.Cell>
                        <Table.Cell>{event.bonusAmount.toFixed(2)} USDC</Table.Cell>
                        <Table.Cell>{event.fighterAmount.toFixed(2)}</Table.Cell>
                        <Table.Cell>{event.gymAmount.toFixed(2)}</Table.Cell>
                        <Table.Cell>{event.organizerAmount.toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          <a
                            href={`https://suiscan.xyz/testnet/tx/${event.txHash}`}
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
              )}
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Card>
    </Box>
  );
}

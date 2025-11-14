import { Box, Button, Card, Flex, Grid, Heading, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

interface DistributionExecutionProps {
  isAdmin: boolean;
  poolBalance: number;
  fighterBalance: number;
  gymBalance: number;
  organizerBalance: number;
  lastDistributedAt: Date | null;
  nextAvailableTime: Date;
  onDistribute: () => Promise<void>;
  onBonusDistribute: (amount: number) => Promise<void>;
  isDistributing: boolean;
  isDistributingBonus: boolean;
}

export function DistributionExecution({
  isAdmin,
  poolBalance,
  fighterBalance,
  gymBalance,
  organizerBalance,
  lastDistributedAt,
  nextAvailableTime,
  onDistribute,
  onBonusDistribute,
  isDistributing,
  isDistributingBonus,
}: DistributionExecutionProps) {
  const [bonusAmount, setBonusAmount] = useState("");
  const [bonusError, setBonusError] = useState("");

  const formatDate = (date: Date | null) => {
    if (!date) return "まだ実行されていません";
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDistributeAvailable = new Date() >= nextAvailableTime;

  const handleBonusDistribute = async () => {
    setBonusError("");
    const amount = parseFloat(bonusAmount);

    if (!amount || amount <= 0) {
      setBonusError("0より大きい金額を入力してください。");
      return;
    }

    if (amount > poolBalance) {
      setBonusError("プール残高を超える額は指定できません。");
      return;
    }

    await onBonusDistribute(amount);
    setBonusAmount("");
  };

  return (
    <Box>
      <Heading size="5" mb="4">
        分配実行
      </Heading>

      {/* 残高＆状態表示 */}
      <Card
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "#11151A",
          marginBottom: "24px",
        }}
      >
        <Heading size="4" mb="3">
          残高
        </Heading>

        <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4" mb="4">
          <Box>
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              DAO プール残高
            </Text>
            <Text size="5" style={{ color: "var(--color-primary)", fontWeight: "700" }}>
              {poolBalance.toLocaleString()} USDC
            </Text>
          </Box>

          <Box>
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Fighter
            </Text>
            <Text size="4" style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>
              {fighterBalance.toLocaleString()} USDC
            </Text>
          </Box>

          <Box>
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Gym
            </Text>
            <Text size="4" style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>
              {gymBalance.toLocaleString()} USDC
            </Text>
          </Box>

          <Box>
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Organizer
            </Text>
            <Text size="4" style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>
              {organizerBalance.toLocaleString()} USDC
            </Text>
          </Box>
        </Grid>

        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          <Box>
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              最終分配実行日時
            </Text>
            <Text size="3" style={{ color: "var(--color-text-primary)" }}>
              {formatDate(lastDistributedAt)}
            </Text>
          </Box>

          <Box>
            <Text
              size="2"
              style={{
                color: "var(--color-text-secondary)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              次回分配実行可能日時
            </Text>
            <Text
              size="3"
              style={{
                color: isDistributeAvailable ? "var(--color-primary)" : "var(--color-text-secondary)",
                fontWeight: isDistributeAvailable ? "600" : "normal",
              }}
            >
              {formatDate(nextAvailableTime)}
            </Text>
          </Box>
        </Grid>
      </Card>

      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        {/* 定期分配実行 */}
        <Card
          style={{
            padding: "24px",
            borderRadius: "12px",
            background: "#11151A",
          }}
        >
          <Heading size="4" mb="3">
            定期分配を実行
          </Heading>

          <Text
            size="2"
            mb="4"
            style={{
              display: "block",
              color: "var(--color-text-secondary)",
              lineHeight: "1.6",
            }}
          >
            分配頻度と最大分配額のルールに従って、DAOプールから自動的に分配します。
            条件を満たしていない場合はトランザクションは失敗します。
          </Text>

          {!isDistributeAvailable && (
            <Box
              mb="3"
              style={{
                background: "rgba(229, 57, 53, 0.1)",
                border: "1px solid var(--color-accent)",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <Text size="2" style={{ color: "var(--color-accent)" }}>
                ⚠️ まだ分配可能な時間になっていません
              </Text>
            </Box>
          )}

          <Button
            size="3"
            style={{
              width: "100%",
              background: (!isAdmin || isDistributing) ? "var(--color-border)" : "var(--color-primary)",
              color: "var(--color-text-primary)",
              cursor: (!isAdmin || isDistributing) ? "not-allowed" : "pointer",
            }}
            disabled={!isAdmin || isDistributing}
            onClick={onDistribute}
          >
            {isDistributing ? "実行中..." : "定期分配を実行する（distribute）"}
          </Button>
        </Card>

        {/* 勝利ボーナス分配 */}
        <Card
          style={{
            padding: "24px",
            borderRadius: "12px",
            background: "#11151A",
          }}
        >
          <Heading size="4" mb="3">
            勝利ボーナス分配
          </Heading>

          <Text
            size="2"
            mb="4"
            style={{
              display: "block",
              color: "var(--color-text-secondary)",
              lineHeight: "1.6",
            }}
          >
            ファイターが勝利したときなどに、指定額を即時に分配します。
            分配率は現在設定されている割合に従います。
          </Text>

          <Box mb="3">
            <Text size="2" mb="2" style={{ display: "block", fontWeight: "600" }}>
              ボーナス額（USDC）
            </Text>
            <TextField.Root
              type="number"
              placeholder="例）500"
              value={bonusAmount}
              onChange={(e) => {
                setBonusAmount(e.target.value);
                setBonusError("");
              }}
              disabled={!isAdmin || isDistributingBonus}
            />
          </Box>

          {bonusError && (
            <Text
              size="2"
              mb="3"
              style={{ display: "block", color: "var(--color-accent)" }}
            >
              {bonusError}
            </Text>
          )}

          <Button
            size="3"
            style={{
              width: "100%",
              background: (!isAdmin || !bonusAmount || isDistributingBonus) ? "var(--color-border)" : "var(--color-primary)",
              color: "var(--color-text-primary)",
              cursor: (!isAdmin || !bonusAmount || isDistributingBonus) ? "not-allowed" : "pointer",
            }}
            disabled={!isAdmin || !bonusAmount || isDistributingBonus}
            onClick={handleBonusDistribute}
          >
            {isDistributingBonus ? "実行中..." : "勝利ボーナスを実行する"}
          </Button>
        </Card>
      </Grid>
    </Box>
  );
}

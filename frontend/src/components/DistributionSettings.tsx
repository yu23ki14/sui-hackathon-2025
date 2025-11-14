import { Box, Button, Card, Flex, Grid, Heading, Text, TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";

interface DistributionDetails {
  periodDays: number;
  maxPerDistribution: number;
  percFighter: number;
  percGym: number;
  percOrganizer: number;
}

interface DistributionSettingsProps {
  isAdmin: boolean;
  distributionDetails: DistributionDetails;
  lastDistributedAt: Date | null;
  onUpdate: (details: DistributionDetails) => Promise<void>;
  isUpdating: boolean;
}

export function DistributionSettings({
  isAdmin,
  distributionDetails,
  lastDistributedAt,
  onUpdate,
  isUpdating,
}: DistributionSettingsProps) {
  const [periodDays, setPeriodDays] = useState(distributionDetails.periodDays.toString());
  const [maxAmount, setMaxAmount] = useState(distributionDetails.maxPerDistribution.toString());
  const [percFighter, setPercFighter] = useState(distributionDetails.percFighter.toString());
  const [percGym, setPercGym] = useState(distributionDetails.percGym.toString());
  const [percOrganizer, setPercOrganizer] = useState(distributionDetails.percOrganizer.toString());
  const [error, setError] = useState("");

  const totalPercentage =
    (parseFloat(percFighter) || 0) +
    (parseFloat(percGym) || 0) +
    (parseFloat(percOrganizer) || 0);

  useEffect(() => {
    setPeriodDays(distributionDetails.periodDays.toString());
    setMaxAmount(distributionDetails.maxPerDistribution.toString());
    setPercFighter(distributionDetails.percFighter.toString());
    setPercGym(distributionDetails.percGym.toString());
    setPercOrganizer(distributionDetails.percOrganizer.toString());
  }, [distributionDetails]);

  const validateAndSubmit = async () => {
    setError("");

    const period = parseFloat(periodDays);
    const max = parseFloat(maxAmount);
    const fighter = parseFloat(percFighter);
    const gym = parseFloat(percGym);
    const organizer = parseFloat(percOrganizer);

    if (!period || period < 1) {
      setError("分配頻度は1日以上である必要があります。");
      return;
    }

    if (!max || max <= 0) {
      setError("最大分配額は0より大きい必要があります。");
      return;
    }

    if (fighter < 0 || gym < 0 || organizer < 0) {
      setError("分配率は0以上である必要があります。");
      return;
    }

    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError("分配率の合計が100%になるように設定してください。");
      return;
    }

    await onUpdate({
      periodDays: period,
      maxPerDistribution: max,
      percFighter: fighter,
      percGym: gym,
      percOrganizer: organizer,
    });
  };

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

  const isFormValid =
    parseFloat(periodDays) >= 1 &&
    parseFloat(maxAmount) > 0 &&
    Math.abs(totalPercentage - 100) < 0.01;

  return (
    <Box>
      <Heading size="5" mb="4">
        分配設定
      </Heading>

      {/* 現在の設定 */}
      <Card
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "#11151A",
          marginBottom: "24px",
        }}
      >
        <Heading size="4" mb="3">
          現在の分配設定
        </Heading>

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
              分配頻度
            </Text>
            <Text size="4" style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>
              {distributionDetails.periodDays} 日ごと
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
              1回の最大分配額
            </Text>
            <Text size="4" style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>
              {distributionDetails.maxPerDistribution.toLocaleString()} USDC
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
              分配率
            </Text>
            <Text size="3" style={{ color: "var(--color-text-primary)" }}>
              Fighter {distributionDetails.percFighter}% / Gym {distributionDetails.percGym}% / Organizer {distributionDetails.percOrganizer}%
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
              最終分配実行日時
            </Text>
            <Text size="3" style={{ color: "var(--color-text-primary)" }}>
              {formatDate(lastDistributedAt)}
            </Text>
          </Box>
        </Grid>
      </Card>

      {/* 変更フォーム（Adminのみ） */}
      <Card
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: isAdmin ? "#11151A" : "#0B0E11",
          border: isAdmin ? "2px solid var(--color-primary)" : "2px solid var(--color-border)",
          opacity: isAdmin ? 1 : 0.6,
        }}
      >
        <Heading size="4" mb="3">
          分配ルールの変更
          {!isAdmin && (
            <Text size="2" style={{ color: "var(--color-text-secondary)", fontWeight: "normal" }}>
              {" "}
              （Adminのみ）
            </Text>
          )}
        </Heading>

        <Grid columns={{ initial: "1", sm: "2" }} gap="4" mb="4">
          {/* 分配頻度 */}
          <Box>
            <Text size="2" mb="2" style={{ display: "block", fontWeight: "600" }}>
              新しい分配頻度（日数）
            </Text>
            <Flex gap="2" align="center">
              <TextField.Root
                type="number"
                placeholder="例）30"
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
                disabled={!isAdmin || isUpdating}
                style={{ flex: 1 }}
              />
              <Text size="2" style={{ color: "var(--color-text-secondary)" }}>
                日
              </Text>
            </Flex>
          </Box>

          {/* 最大分配額 */}
          <Box>
            <Text size="2" mb="2" style={{ display: "block", fontWeight: "600" }}>
              1回の最大分配額（USDC）
            </Text>
            <TextField.Root
              type="number"
              placeholder="例）3000"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              disabled={!isAdmin || isUpdating}
            />
          </Box>
        </Grid>

        {/* 分配率 */}
        <Box mb="4">
          <Text size="2" mb="2" style={{ display: "block", fontWeight: "600" }}>
            分配率（%）
          </Text>
          <Grid columns={{ initial: "1", sm: "3" }} gap="3">
            <Box>
              <Text size="1" mb="1" style={{ display: "block", color: "var(--color-text-secondary)" }}>
                Fighter %
              </Text>
              <TextField.Root
                type="number"
                placeholder="70"
                value={percFighter}
                onChange={(e) => setPercFighter(e.target.value)}
                disabled={!isAdmin || isUpdating}
              />
            </Box>
            <Box>
              <Text size="1" mb="1" style={{ display: "block", color: "var(--color-text-secondary)" }}>
                Gym %
              </Text>
              <TextField.Root
                type="number"
                placeholder="20"
                value={percGym}
                onChange={(e) => setPercGym(e.target.value)}
                disabled={!isAdmin || isUpdating}
              />
            </Box>
            <Box>
              <Text size="1" mb="1" style={{ display: "block", color: "var(--color-text-secondary)" }}>
                Organizer %
              </Text>
              <TextField.Root
                type="number"
                placeholder="10"
                value={percOrganizer}
                onChange={(e) => setPercOrganizer(e.target.value)}
                disabled={!isAdmin || isUpdating}
              />
            </Box>
          </Grid>
          <Text
            size="2"
            mt="2"
            style={{
              display: "block",
              color: Math.abs(totalPercentage - 100) < 0.01 ? "var(--color-primary)" : "var(--color-accent)",
              fontWeight: "600",
            }}
          >
            合計：{totalPercentage.toFixed(1)}%
          </Text>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Text size="2" mb="3" style={{ display: "block", color: "var(--color-accent)" }}>
            {error}
          </Text>
        )}

        {/* 更新ボタン */}
        <Button
          size="3"
          style={{
            width: "100%",
            background: (!isAdmin || !isFormValid || isUpdating) ? "var(--color-border)" : "var(--color-primary)",
            color: "var(--color-text-primary)",
            cursor: (!isAdmin || !isFormValid || isUpdating) ? "not-allowed" : "pointer",
          }}
          disabled={!isAdmin || !isFormValid || isUpdating}
          onClick={validateAndSubmit}
        >
          {isUpdating ? "更新中..." : "分配ルールを更新する"}
        </Button>
      </Card>
    </Box>
  );
}

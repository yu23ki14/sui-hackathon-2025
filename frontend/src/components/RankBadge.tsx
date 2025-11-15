import { Box, Text } from "@radix-ui/themes";
import { rankConfig } from "../config";

export type Rank = "None" | "Bronze" | "Silver" | "Gold" | "Platinum";

interface RankBadgeProps {
  totalSupportAmount: number; // Total support amount in USDC
}

/**
 * Determine rank based on total support amount (matches contract logic)
 * @param totalSupportAmount - Total support amount in USDC
 * @returns Rank
 */
export function getRank(totalSupportAmount: number): Rank {
  if (totalSupportAmount >= rankConfig.platinum.minAmount) return "Platinum";
  if (totalSupportAmount >= rankConfig.gold.minAmount) return "Gold";
  if (totalSupportAmount >= rankConfig.silver.minAmount) return "Silver";
  if (totalSupportAmount >= rankConfig.bronze.minAmount) return "Bronze";
  return "None";
}

const rankStyles = {
  Platinum: {
    gradient: "linear-gradient(135deg, #E0F2F7 0%, #B2EBF2 50%, #80DEEA 100%)",
    shadow: "0 8px 24px rgba(128, 222, 234, 0.5)",
    border: "2px solid #4DD0E1",
    textColor: "#1A1A1A",
    glow: "0 0 20px rgba(128, 222, 234, 0.7)",
  },
  Gold: {
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
    shadow: "0 8px 24px rgba(255, 215, 0, 0.4)",
    border: "2px solid #FFE55C",
    textColor: "#1A1A1A",
    glow: "0 0 20px rgba(255, 215, 0, 0.6)",
  },
  Silver: {
    gradient: "linear-gradient(135deg, #E8E8E8 0%, #B0BEC5 50%, #90A4AE 100%)",
    shadow: "0 8px 24px rgba(176, 190, 197, 0.4)",
    border: "2px solid #FFFFFF",
    textColor: "#1A1A1A",
    glow: "0 0 20px rgba(176, 190, 197, 0.6)",
  },
  Bronze: {
    gradient: "linear-gradient(135deg, #E5974D 0%, #CD7F32 50%, #A0522D 100%)",
    shadow: "0 8px 24px rgba(205, 127, 50, 0.4)",
    border: "2px solid #F4A460",
    textColor: "#1A1A1A",
    glow: "0 0 20px rgba(205, 127, 50, 0.6)",
  },
  None: {
    gradient: "linear-gradient(135deg, #3A3F44 0%, #2A2F34 50%, #1A1F24 100%)",
    shadow: "0 4px 12px rgba(42, 47, 52, 0.3)",
    border: "2px solid #4A4F54",
    textColor: "#9CA3AF",
    glow: "none",
  },
};

function getRankConditionText(rank: Rank): string {
  if (rank === "Platinum") return `${rankConfig.platinum.minAmount} USDC以上`;
  if (rank === "Gold")
    return `${rankConfig.gold.minAmount}〜${rankConfig.platinum.minAmount - 1} USDC`;
  if (rank === "Silver")
    return `${rankConfig.silver.minAmount}〜${rankConfig.gold.minAmount - 1} USDC`;
  if (rank === "Bronze")
    return `${rankConfig.bronze.minAmount}〜${rankConfig.silver.minAmount - 1} USDC`;
  return "0 USDC";
}

function getRankIcon(rank: Rank): string {
  if (rank === "Platinum") return rankConfig.platinum.icon;
  if (rank === "Gold") return rankConfig.gold.icon;
  if (rank === "Silver") return rankConfig.silver.icon;
  if (rank === "Bronze") return rankConfig.bronze.icon;
  return "—";
}

function getRankLabel(rank: Rank): string {
  if (rank === "Platinum") return rankConfig.platinum.label;
  if (rank === "Gold") return rankConfig.gold.label;
  if (rank === "Silver") return rankConfig.silver.label;
  if (rank === "Bronze") return rankConfig.bronze.label;
  return "No Member";
}

export function RankBadge({ totalSupportAmount }: RankBadgeProps) {
  const rank = getRank(totalSupportAmount);
  const style = rankStyles[rank];

  return (
    <Box>
      <Text
        size="2"
        style={{
          color: "var(--color-text-secondary)",
          display: "block",
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: "600",
        }}
      >
        Member Rank
      </Text>
      <Box
        style={{
          position: "relative",
          background: style.gradient,
          border: style.border,
          borderRadius: "16px",
          padding: "24px 32px",
          boxShadow: style.shadow,
          display: "inline-block",
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        {/* 装飾的な輝き効果 */}
        {rank !== "None" && (
          <Box
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: style.glow,
            }}
          />
        )}

        {/* アイコン */}
        <Text
          style={{
            fontSize: "32px",
            display: "block",
            marginBottom: "8px",
          }}
        >
          {getRankIcon(rank)}
        </Text>

        {/* ランク名 */}
        <Text
          style={{
            color: style.textColor,
            fontSize: "28px",
            fontWeight: "900",
            display: "block",
            marginBottom: "4px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            letterSpacing: "0.05em",
          }}
        >
          {getRankLabel(rank).toUpperCase()}
        </Text>

        {/* 総支援額 */}
        <Text
          style={{
            color: style.textColor,
            fontSize: "14px",
            fontWeight: "600",
            display: "block",
            opacity: 0.8,
          }}
        >
          {totalSupportAmount.toFixed(2)} USDC
        </Text>

        {/* 装飾的な下線 */}
        <Box
          style={{
            width: "60%",
            height: "2px",
            background: "rgba(255, 255, 255, 0.3)",
            margin: "12px auto 8px",
            borderRadius: "1px",
          }}
        />

        {/* 条件 */}
        <Text
          style={{
            color: style.textColor,
            fontSize: "12px",
            display: "block",
            opacity: 0.7,
          }}
        >
          {getRankConditionText(rank)}
        </Text>
      </Box>
    </Box>
  );
}

import { Box, Container, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { DAOInfoCard } from "../components/DAOInfoCard";
import { WalletInfo } from "../components/WalletInfo";
import { SupportForm } from "../components/SupportForm";
import { FeedbackAlert } from "../components/FeedbackAlert";
import { useWalletConnection, useUsdcBalance, useSupport, useDaoInfo } from "../hooks";

export default function Support() {
  const { walletAddress } = useWalletConnection();
  const { balance: usdcBalance, refetch: refetchBalance } = useUsdcBalance();
  const { executeSupport, isSubmitting, txHash, reset } = useSupport();
  const { daoInfo } = useDaoInfo();

  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSupport = async (amount: number) => {
    setErrorMessage(null);
    setSuccessTxHash(null);

    try {
      const result = await executeSupport(amount);

      if (result.success && result.txHash) {
        setSuccessTxHash(result.txHash);
        // Refetch balance after successful support
        await refetchBalance();
      } else {
        setErrorMessage(result.error || "トランザクションに失敗しました。");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "トランザクションに失敗しました。ウォレットの状態を確認して、もう一度お試しください。"
      );
    }
  };

  const handleCloseSuccess = () => {
    setSuccessTxHash(null);
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  return (
    <Container size="3">
      {/* ヘッダー & タイトル */}
      <Box mb="6" style={{ textAlign: "center" }}>
        <Box
          style={{
            display: "inline-block",
            background: "var(--color-primary)",
            color: "var(--color-text-primary)",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Support TEAM KENTA
        </Box>

        <Heading size="8" mb="3">
          サポートして、KENTAの挑戦を支える
        </Heading>

        <Text
          size="3"
          style={{
            color: "var(--color-text-secondary)",
            display: "block",
            lineHeight: "1.7",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          USDC で支援すると、資金は DAO プールに蓄積され、
          <br />
          スマートコントラクトによって選手・ジム・幹事に自動分配されます。
        </Text>
      </Box>

      {/* フィードバック（成功） */}
      {successTxHash && (
        <Box mb="4">
          <FeedbackAlert
            type="success"
            message="Members NFT があなたのウォレットにミントされました。"
            txHash={successTxHash}
            onClose={handleCloseSuccess}
          />
        </Box>
      )}

      {/* フィードバック（失敗） */}
      {errorMessage && (
        <Box mb="4">
          <FeedbackAlert
            type="error"
            message={errorMessage}
            onClose={handleCloseError}
            onRetry={() => setErrorMessage(null)}
          />
        </Box>
      )}

      {/* サポート対象情報（DAO概要） */}
      {!successTxHash && (
        <>
          <Box mb="4">
            <DAOInfoCard
              name={daoInfo?.name || "TEAM KENTA DAO"}
              description="ONE 参戦を目指すバンタム級ファイター KENTA を支えるコミュニティプールです。"
              fighterPercentage={daoInfo?.fighterPercentage || 70}
              gymPercentage={daoInfo?.gymPercentage || 20}
              organizerPercentage={daoInfo?.organizerPercentage || 10}
            />
          </Box>

          {/* ウォレット／残高情報 */}
          <Box mb="4">
            <WalletInfo
              walletAddress={walletAddress}
              usdcBalance={usdcBalance}
            />
          </Box>

          {/* 入力フォーム */}
          <Box mb="4">
            <SupportForm
              walletAddress={walletAddress}
              usdcBalance={usdcBalance}
              onSubmit={handleSupport}
              isSubmitting={isSubmitting}
            />
          </Box>
        </>
      )}
    </Container>
  );
}

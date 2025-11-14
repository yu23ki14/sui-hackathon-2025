import { Box, Container } from "@radix-ui/themes";
import { AdminInfoBar } from "../components/AdminInfoBar";
import { DistributionSettings } from "../components/DistributionSettings";
import { DistributionExecution } from "../components/DistributionExecution";
import { EventHistoryTabs } from "../components/EventHistoryTabs";
import {
  useWalletConnection,
  useAdminStatus,
  useDistributionSettings,
  useDistributionExecution,
  useEventHistory,
} from "../hooks";
import { adminPageConfig } from "../config";

export default function Admin() {
  const { walletAddress } = useWalletConnection();
  const { isAdmin } = useAdminStatus();
  const {
    settings: distributionDetails,
    lastDistributedAt,
    updateSettings,
    isUpdating: isUpdatingRules,
  } = useDistributionSettings();
  const {
    balances,
    nextAvailableTime,
    executeDistribute,
    executeBonusDistribute,
    isDistributing,
    isDistributingBonus,
  } = useDistributionExecution(
    distributionDetails.periodDays,
    lastDistributedAt
  );
  const {
    supportEvents,
    distributeEvents,
    bonusEvents,
    isLoading: isLoadingEvents,
  } = useEventHistory();

  // ハンドラー
  const handleUpdateRules = async (newDetails: typeof distributionDetails) => {
    try {
      await updateSettings(newDetails);
      alert(adminPageConfig.distributionSettings.updateSuccessMessage);
    } catch (error) {
      alert(adminPageConfig.distributionSettings.updateErrorMessage);
    }
  };

  const handleDistribute = async () => {
    try {
      await executeDistribute();
      alert(adminPageConfig.distributionExecution.executeSuccessMessage);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : adminPageConfig.distributionExecution.executeErrorMessage
      );
    }
  };

  const handleBonusDistribute = async (amount: number) => {
    try {
      await executeBonusDistribute(amount);
      const message = adminPageConfig.distributionExecution.bonusSuccessMessage.replace(
        "{amount}",
        amount.toString()
      );
      alert(message);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : adminPageConfig.distributionExecution.bonusErrorMessage
      );
    }
  };

  return (
    <Container size="4">
      {/* Admin情報バー */}
      <AdminInfoBar
        walletAddress={walletAddress}
        isAdmin={isAdmin}
      />

      {/* セクションA: 分配設定 */}
      <Box mb="6">
        <DistributionSettings
          isAdmin={isAdmin}
          distributionDetails={distributionDetails}
          lastDistributedAt={lastDistributedAt}
          onUpdate={handleUpdateRules}
          isUpdating={isUpdatingRules}
        />
      </Box>

      {/* セクションB: 分配実行 */}
      <Box mb="6">
        <DistributionExecution
          isAdmin={isAdmin}
          poolBalance={balances.pool}
          fighterBalance={balances.fighter}
          gymBalance={balances.gym}
          organizerBalance={balances.organizer}
          lastDistributedAt={lastDistributedAt}
          nextAvailableTime={nextAvailableTime}
          onDistribute={handleDistribute}
          onBonusDistribute={handleBonusDistribute}
          isDistributing={isDistributing}
          isDistributingBonus={isDistributingBonus}
        />
      </Box>

      {/* セクションC: イベント履歴 */}
      <Box mb="6">
        <EventHistoryTabs
          supportEvents={supportEvents}
          distributeEvents={distributeEvents}
          bonusEvents={bonusEvents}
          isLoading={isLoadingEvents}
        />
      </Box>
    </Container>
  );
}


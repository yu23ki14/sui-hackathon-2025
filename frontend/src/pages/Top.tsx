import { Container } from "@radix-ui/themes";
import { HeroSection } from "../components/HeroSection";
import { StatusCards } from "../components/StatusCards";
import { DistributionSection } from "../components/DistributionSection";
import { TrustSection } from "../components/TrustSection";
import {
  useDaoInfo,
  useDistributionExecution,
  useDistributionSettings,
  useEventHistory,
} from "../hooks";

export default function Top() {
  const { daoInfo } = useDaoInfo();
  const { settings } = useDistributionSettings();
  const { balances, nextAvailableTime } = useDistributionExecution(
    settings.periodDays,
    null
  );
  const { supportEvents } = useEventHistory();

  // Calculate total support amount from support events
  const totalSupportAmount = supportEvents.reduce(
    (sum, event) => sum + event.amount,
    0
  );

  // Calculate unique supporter count from support events
  const uniqueSupporters = new Set(supportEvents.map((event) => event.supporter));
  const supporterCount = uniqueSupporters.size;

  return (
    <Container size="4">
      <HeroSection />
      <StatusCards
        poolBalance={balances.pool}
        totalSupportAmount={totalSupportAmount}
        supporterCount={supporterCount}
        nextAvailableTime={nextAvailableTime}
      />
      <DistributionSection
        fighterPercentage={daoInfo?.fighterPercentage || 70}
        gymPercentage={daoInfo?.gymPercentage || 20}
        organizerPercentage={daoInfo?.organizerPercentage || 10}
      />
      <TrustSection />
    </Container>
  );
}

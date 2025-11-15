import { useState, useEffect } from "react";
import suiClient from "../lib/suiClient";
import { CONTRACT_ADDRESSES } from "../lib/contractAddresses";

export interface DistributionSettings {
  periodDays: number;
  maxPerDistribution: number;
  percFighter: number;
  percGym: number;
  percOrganizer: number;
}

/**
 * Hook to manage distribution settings (read and update)
 */
export function useDistributionSettings() {
  const [settings, setSettings] = useState<DistributionSettings>({
    periodDays: 30,
    maxPerDistribution: 3000,
    percFighter: 70,
    percGym: 20,
    percOrganizer: 10,
  });
  const [lastDistributedAt, setLastDistributedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const daoPoolAddress = CONTRACT_ADDRESSES.DAO_CONTRACT;

      // Fetch DaoPoolState object from blockchain
      const result = await suiClient.getObject({
        id: daoPoolAddress,
        options: {
          showContent: true,
        },
      });

      if (result.data?.content && "fields" in result.data.content) {
        const fields = result.data.content.fields as any;

        // Extract distribution settings
        const distributionIntervalMs = Number(fields.distribution_interval || 0);
        const periodDays = distributionIntervalMs / (1000 * 60 * 60 * 24); // Convert ms to days

        const supportCap = Number(fields.support_cap || 0);
        const maxPerDistribution = supportCap / 1_000_000_000; // Convert from smallest unit to SUI (9 decimals)

        setSettings({
          periodDays,
          maxPerDistribution,
          percFighter: Number(fields.fighter_ratio || 70),
          percGym: Number(fields.gym_ratio || 20),
          percOrganizer: Number(fields.organizer_ratio || 10),
        });

        // Extract last distribution timestamp
        const lastDistributionMs = Number(fields.last_distribution || 0);
        if (lastDistributionMs > 0) {
          setLastDistributedAt(new Date(lastDistributionMs));
        } else {
          setLastDistributedAt(null);
        }

        console.log("Distribution settings fetched:", {
          periodDays,
          maxPerDistribution,
          lastDistributionMs,
          fields,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch distribution settings"));
      console.error("Error fetching distribution settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: DistributionSettings): Promise<void> => {
    setIsUpdating(true);
    setError(null);

    try {
      // TODO: Update distribution settings on blockchain (Admin only)
      // const tx = await daoContract.changeDistributionDetails(
      //   newSettings.periodDays * 24 * 60 * 60, // Convert days to seconds
      //   newSettings.maxPerDistribution * 1_000_000, // Convert to smallest unit
      //   newSettings.percFighter,
      //   newSettings.percGym,
      //   newSettings.percOrganizer
      // );
      // await tx.wait();

      console.log("TODO: Update distribution settings on blockchain", newSettings);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update local state
      setSettings(newSettings);

      // Refetch to ensure sync
      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update distribution settings"));
      console.error("Error updating distribution settings:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    lastDistributedAt,
    updateSettings,
    isLoading,
    isUpdating,
    error,
    refetch: fetchSettings,
  };
}

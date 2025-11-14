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
      // TODO: Fetch distribution settings from blockchain
      // const result = await daoContract.getDistributionDetails();
      // setSettings({
      //   periodDays: result.periodSeconds / (24 * 60 * 60),
      //   maxPerDistribution: result.maxPerDistribution / 1_000_000,
      //   percFighter: result.fighterPercentage,
      //   percGym: result.gymPercentage,
      //   percOrganizer: result.organizerPercentage,
      // });

      console.log("TODO: Fetch distribution settings from blockchain");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Fetch last distribution timestamp
      // const lastDistribution = await daoContract.getLastDistributionTime();
      // setLastDistributedAt(new Date(lastDistribution * 1000));

      console.log("TODO: Fetch last distribution timestamp");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - remove after implementing blockchain integration
      setLastDistributedAt(new Date("2025-11-10T21:00:00"));
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

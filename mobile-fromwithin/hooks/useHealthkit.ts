// hooks/useHealthkit.ts

import {
  useHealthkitAuthorization,
  useMostRecentQuantitySample,
  useMostRecentCategorySample,
} from "@kingstinct/react-native-healthkit";

const READ_TYPES = [
  "HKQuantityTypeIdentifierStepCount",
  "HKQuantityTypeIdentifierHeartRate",
  "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
  "HKQuantityTypeIdentifierRespiratoryRate",
  "HKCategoryTypeIdentifierSleepAnalysis",
  "HKCategoryTypeIdentifierMindfulSession",
] as const;

export function useFromWithinHealth() {
  const [authStatus, requestAuthorization] = useHealthkitAuthorization(
    READ_TYPES as unknown as string[]
  );

  const steps = useMostRecentQuantitySample(
    "HKQuantityTypeIdentifierStepCount"
  );
  const heartRate = useMostRecentQuantitySample(
    "HKQuantityTypeIdentifierHeartRate"
  );
  const hrv = useMostRecentQuantitySample(
    "HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
  );
  const sleep = useMostRecentCategorySample(
    "HKCategoryTypeIdentifierSleepAnalysis"
  );

  return {
    authStatus,
    requestAuthorization,
    steps,
    heartRate,
    hrv,
    sleep,
  };
}

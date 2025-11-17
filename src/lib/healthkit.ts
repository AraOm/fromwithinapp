// src/lib/healthkit.ts
// Web stub for Apple Health / HealthKit.
// The real native implementation lives in the iOS app.
// Here we just provide no-op functions so the web build compiles cleanly.

export type HealthSummary = {
  steps?: number | null;
  hrv?: number | null;
  sleepMinutes?: number | null;
  restingHeartRate?: number | null;
};

function logNotAvailable() {
  if (typeof window !== "undefined") {
    console.warn(
      "[HealthKit] Apple Health is only available in the iOS app, not on the web."
    );
  }
}

/**
 * Ask the user for Apple Health / Apple Watch permissions.
 * Web: no-op, always returns false.
 */
export async function requestHealthPermissions(): Promise<boolean> {
  logNotAvailable();
  return false;
}

/**
 * Get a small summary of recent health metrics.
 * Web: returns null so callers can handle “no data”.
 */
export async function getHealthSummary(): Promise<HealthSummary | null> {
  logNotAvailable();
  return null;
}

/**
 * Convenience: is HealthKit available on this platform?
 * Web: always false.
 */
export function isHealthKitAvailable(): boolean {
  return false;
}

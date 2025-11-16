// src/lib/healthkit.ts

import Healthkit, {
    HKQuantityTypeIdentifier,
    HKCategoryTypeIdentifier,
  } from "@kingstinct/react-native-healthkit";
  
  /**
   * Ask the user for Apple Health / Apple Watch permissions.
   * Returns true if sharing is authorized.
   */
  export async function requestHealthAuthorization(): Promise<boolean> {
    const isAvailable = await Healthkit.isHealthDataAvailable();
  
    if (!isAvailable) {
      console.warn("Health data is not available on this device.");
      return false;
    }
  
    const permissions = {
      read: [
        HKQuantityTypeIdentifier.heartRate,
        HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
        HKQuantityTypeIdentifier.stepCount,
        HKQuantityTypeIdentifier.respiratoryRate,
        HKCategoryTypeIdentifier.sleepAnalysis,
        HKCategoryTypeIdentifier.mindfulSession
      ],
      write: [
        HKCategoryTypeIdentifier.mindfulSession
      ]
    };
  
    try {
      await Healthkit.requestAuthorization(permissions);
      return true;
    } catch (error) {
      console.error("HealthKit authorization error:", error);
      return false;
    }
  }
  
// screens/HealthScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFromWithinHealth } from "../hooks/useHealthkit";

export default function HealthScreen() {
  const { authStatus, requestAuthorization, steps, heartRate, hrv, sleep } =
    useFromWithinHealth();

  useEffect(() => {
    // Ask for permissions on first load
    requestAuthorization().catch((err) => {
      console.warn("HealthKit authorization error", err);
    });
  }, []);

  const stepsLabel =
    steps && typeof steps === "number" ? `${steps} steps` : "no sample yet";

  const hrLabel =
    heartRate && typeof heartRate === "number"
      ? `${heartRate} bpm`
      : "no sample yet";

  const hrvLabel =
    hrv && typeof hrv === "number" ? `${hrv} ms (SDNN)` : "no sample yet";

  const sleepLabel =
    sleep && typeof sleep === "string"
      ? sleep
      : "no recent sleep sample";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>FromWithin + Apple Health</Text>
        <Text style={styles.status}>HealthKit status: {authStatus}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => requestAuthorization()}
        >
          <Text style={styles.buttonText}>Re-request permissions</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest data</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Steps:</Text>
            <Text style={styles.value}>{stepsLabel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Heart rate:</Text>
            <Text style={styles.value}>{hrLabel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>HRV (SDNN):</Text>
            <Text style={styles.value}>{hrvLabel}</Text>
          </View>

          <View style={[styles.row, { marginTop: 16 }]}>
            <Text style={styles.label}>Sleep sample:</Text>
            <Text style={styles.value}>{sleepLabel}</Text>
          </View>
        </View>

        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Terms of Use</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    color: "#022c22",
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    fontSize: 15,
    color: "#9ca3af",
  },
  value: {
    fontSize: 15,
    color: "#e5e7eb",
  },
  footerLinks: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerLink: {
    fontSize: 13,
    color: "#9ca3af",
  },
  footerDot: {
    fontSize: 12,
    color: "#6b7280",
    marginHorizontal: 6,
  },
});

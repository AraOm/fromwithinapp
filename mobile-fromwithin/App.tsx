// mobile-fromwithin/App.tsx
import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useFromWithinHealth } from "./hooks/useHealthkit";

export default function App() {
  const { authStatus, requestAuthorization, steps, heartRate, hrv, sleep } =
    useFromWithinHealth();

  useEffect(() => {
    // Ask for permissions on first load
    requestAuthorization().catch((err) => {
      console.warn("HealthKit auth error", err);
    });
  }, [requestAuthorization]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          FromWithin + Apple Health
        </Text>

        <Text style={{ color: "#94a3b8", marginBottom: 16 }}>
          HealthKit status: {authStatus ?? "unknown"}
        </Text>

        <TouchableOpacity
          onPress={() => requestAuthorization()}
          style={{
            backgroundColor: "#22c55e",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 999,
            alignSelf: "flex-start",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#020617",
              fontWeight: "600",
            }}
          >
            Re-request permissions
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "white",
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          Latest data
        </Text>

        <Text style={{ color: "#cbd5f5", marginBottom: 4 }}>
          Steps:{" "}
          {steps?.sample?.quantity
            ? `${steps.sample.quantity} (${steps.sample.startDate.toString()})`
            : "no sample yet"}
        </Text>

        <Text style={{ color: "#cbd5f5", marginBottom: 4 }}>
          Heart rate:{" "}
          {heartRate?.sample?.quantity
            ? `${heartRate.sample.quantity} bpm`
            : "no sample yet"}
        </Text>

        <Text style={{ color: "#cbd5f5", marginBottom: 4 }}>
          HRV (SDNN):{" "}
          {hrv?.sample?.quantity
            ? `${hrv.sample.quantity} ms`
            : "no sample yet"}
        </Text>

        <Text style={{ color: "#cbd5f5", marginTop: 12 }}>
          Sleep sample:{" "}
          {sleep?.sample
            ? `${sleep.sample.startDate.toString()} → ${sleep.sample.endDate.toString()}`
            : "no recent sleep sample"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

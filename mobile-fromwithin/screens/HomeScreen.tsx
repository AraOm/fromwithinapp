// screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.appTitle}>FromWithin</Text>
        <Text style={styles.tagline}>
          Self-awareness begins in stillness.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today’s Snapshot</Text>
          <Text style={styles.cardText}>
            Connect your biometrics, tune into your energy, and let your inner
            guidance lead the way.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Next steps</Text>
          <Text style={styles.cardBullet}>• Connect Apple Health</Text>
          <Text style={styles.cardBullet}>• Check your daily energy</Text>
          <Text style={styles.cardBullet}>• Reflect with a short journal</Text>
        </View>

        <Text style={styles.footerText}>
          This is your early mobile Home screen — we’ll grow it into the full
          Today experience.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617", // deep slate / navy
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f9fafb",
  },
  tagline: {
    marginTop: 6,
    fontSize: 15,
    color: "#9ca3af",
  },
  card: {
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.35)",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    padding: 16,
  },
  cardLabel: {
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#a5b4fc",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: "#e5e7eb",
  },
  cardBullet: {
    fontSize: 15,
    color: "#e5e7eb",
    marginTop: 4,
  },
  footerText: {
    marginTop: 24,
    fontSize: 13,
    color: "#6b7280",
  },
});

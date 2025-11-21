// mobile-fromwithin/components/ZenPlaylistsMobile.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { openSpotifyPlaylist } from "../utils/spotify";

export default function ZenPlaylistsMobile() {
  // 👉 Replace these with your real playlist IDs
  const PLAYLISTS = [
    {
      id: "37i9dQZF1DX3rxVfibe1L0", // example ID
      label: "Deep Rest",
      tagline: "Melt into stillness.",
    },
    {
      id: "37i9dQZF1DWZeKCadgRdKQ", // example ID
      label: "Calm Focus",
      tagline: "Soft focus, clear mind.",
    },
    {
      id: "37i9dQZF1DX3PIPIT6lEg5", // example ID
      label: "Morning Glow",
      tagline: "Ease into your day.",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zen Playlists</Text>
      <Text style={styles.subtitle}>
        Press a card to open in Spotify.
      </Text>

      {PLAYLISTS.map((pl) => (
        <TouchableOpacity
          key={pl.id}
          style={styles.card}
          onPress={() => openSpotifyPlaylist(pl.id)}
        >
          <Text style={styles.cardLabel}>{pl.label}</Text>
          <Text style={styles.cardTagline}>{pl.tagline}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#9ca3af",
  },
  card: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4b5563",
    backgroundColor: "#020617",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f9fafb",
  },
  cardTagline: {
    marginTop: 2,
    fontSize: 12,
    color: "#9ca3af",
  },
});

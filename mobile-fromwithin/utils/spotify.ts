// mobile-fromwithin/utils/spotify.ts
import { Alert, Linking } from "react-native";

/**
 * Open a Spotify playlist by ID in the Spotify app (or browser fallback)
 */
export async function openSpotifyPlaylist(playlistId: string) {
  try {
    const url = `https://open.spotify.com/playlist/${playlistId}`;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert(
        "Spotify not available",
        "We couldn't open Spotify on this device."
      );
      return;
    }

    await Linking.openURL(url);
  } catch (error) {
    console.error("Error opening Spotify playlist", error);
    Alert.alert("Error", "Could not open Spotify playlist.");
  }
}

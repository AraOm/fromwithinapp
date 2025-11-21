// mobile-fromwithin/utils/wearables.ts
import Constants from "expo-constants";
import { Alert, Linking } from "react-native";

export type WearableId =
  | "fitbit"
  | "oura"
  | "googlefit"
  | "samsung"
  | "garmin";

const extra = Constants.expoConfig?.extra as any;
const wearableConnect: Record<string, string> =
  (extra && extra.wearableConnect) || {};

/**
 * Get the connect URL for a wearable from Expo extra config.
 */
export function getWearableConnectUrl(id: WearableId): string | undefined {
  return wearableConnect[id];
}

/**
 * Open the wearable connect URL in the system browser.
 */
export async function openWearableConnect(
  id: WearableId,
  label: string
): Promise<void> {
  const url = getWearableConnectUrl(id);

  // 🔍 DEBUG — this tells us EXACTLY what URL is being used
  console.log("WEARABLE DEBUG →", id, "URL:", url);

  if (!url) {
    Alert.alert(
      "Not configured",
      `${label} connection is not set up yet.`
    );
    return;
  }

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert(
      "Unable to open",
      "We couldn't open the connection page."
    );
    return;
  }

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("Error opening wearable connect URL", error);
    Alert.alert(
      "Connection error",
      "Something went wrong connecting this wearable."
    );
  }
}

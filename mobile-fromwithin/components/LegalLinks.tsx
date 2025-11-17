// components/LegalLinks.tsx
import { Text, View, Linking, TouchableOpacity } from "react-native";

export function LegalLinks() {
  return (
    <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "center" }}>
      <TouchableOpacity onPress={() => Linking.openURL("https://fromwithinapp.com/privacy")}>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Privacy Policy</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: "#9CA3AF" }}>  •  </Text>

      <TouchableOpacity onPress={() => Linking.openURL("https://fromwithinapp.com/terms")}>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Terms of Use</Text>
      </TouchableOpacity>
    </View>
  );
}

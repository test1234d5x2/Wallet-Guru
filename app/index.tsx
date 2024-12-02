import { Text, View } from "react-native";
import Page from "./components/page";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Wallet Guru</Text>
      <Page></Page>
    </View>
  );
}

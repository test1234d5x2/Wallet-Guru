import { Text, View, StyleSheet, Dimensions } from "react-native";
import TopBar from "./components/topBar";

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    minHeight: Dimensions.get("window")['height'],
  }
});

export default function Index() {
  return (
    <View style={styles.root}>
      <TopBar />
    </View>
  );
}

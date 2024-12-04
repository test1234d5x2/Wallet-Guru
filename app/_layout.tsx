import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return <Stack screenOptions={{headerStyle: {backgroundColor: "black"}, headerTintColor: "white"}} />;
}

import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{headerStyle: {backgroundColor: "white"}, headerTintColor: "black", headerBackButtonDisplayMode: "minimal"}} />;
}

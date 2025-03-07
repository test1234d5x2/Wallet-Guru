// app/_layout.tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, Slot } from 'expo-router';
import BottomNav from '@/components/bottomNav/bottomNav';


export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Stack>
          <Slot />
        </Stack>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1,
  },
});

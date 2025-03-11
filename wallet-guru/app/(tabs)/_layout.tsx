import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { Stack, Slot } from 'expo-router'
  

export default function RootLayout() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Slot />
                </Stack>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
})
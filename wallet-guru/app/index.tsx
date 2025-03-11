import setPageTitle from "@/components/pageTitle/setPageTitle"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, StatusBar, View, StyleSheet } from "react-native"

export default function Index() {

    setPageTitle("Welcome!")

    const router = useRouter()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (isReady) {
            router.replace("/loginPage")
        }
    }, [isReady])

    return (
        <View style={styles.main}>
            <StatusBar barStyle={"dark-content"} />

            <ActivityIndicator color={"black"} />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "white",
    }
})

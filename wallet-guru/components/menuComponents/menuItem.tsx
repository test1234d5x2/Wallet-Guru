import { StyleSheet, Text } from "react-native"
import { Link } from "expo-router"

interface MenuDisplayProps {
    title: string
    url: string
}

export default function MenuItem(props: MenuDisplayProps) {
    return (
        <Link href={props.url} replace>
            <Text style={styles.menuText}>{props.title}</Text>
        </Link>
    )
}

const styles = StyleSheet.create({
    menuText: {
        fontSize: 18,
        textDecorationLine: "underline",
    },
})

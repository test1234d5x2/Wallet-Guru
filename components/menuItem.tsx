import { StyleSheet, Text, TouchableOpacity } from "react-native";



const styles = StyleSheet.create({
    menuText: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
})


interface MenuDisplayProps {
    title: string
}

export default function MenuItem(props: MenuDisplayProps) {
    return (
        <TouchableOpacity>
            <Text style={styles.menuText}>{props.title}</Text>
        </TouchableOpacity>
    )
}
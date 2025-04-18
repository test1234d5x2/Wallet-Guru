import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet } from "react-native"


interface ListItemDeleteButtonProps {
    id: string
    handleDelete: (id: string) => void
}


export default function ListItemDeleteButton(props: ListItemDeleteButtonProps) {
    return (
        <TouchableOpacity style={styles.deleteButton} onPress={() => props.handleDelete(props.id)} testID="delete-button">
            <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: "#FF4C4C",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
})
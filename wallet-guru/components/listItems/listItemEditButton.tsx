import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";


interface ListItemEditButtonProps {
    id: string
    handleEdit: (id: string) => void
}


export default function ListItemEditButton(props: ListItemEditButtonProps) {
    return (
        <TouchableOpacity style={styles.editButton} onPress={() => props.handleEdit(props.id)} testID="edit-button">
            <Ionicons name="pencil-outline" size={20} color="#fff" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    editButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
})
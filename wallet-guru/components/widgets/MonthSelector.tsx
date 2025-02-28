import getMonthName from "@/utils/getMonthName";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";


interface MonthSelectorProps {
    month: Date;
    setMonth: (d: Date) => void;
}


export default function MonthSelector(props: MonthSelectorProps) {
    return (
        <View style={styles.monthSelectorContainer} >
            <Ionicons name="arrow-back" size={24} color="black" onPress={() => props.setMonth(new Date(Date.UTC(props.month.getUTCFullYear(), props.month.getUTCMonth() - 1)))
            } />
            <Text style={styles.monthHeader} >
                {getMonthName(props.month)} {props.month.getUTCFullYear()}
            </Text>
            < Ionicons name="arrow-forward" size={24} color="black" onPress={() => props.setMonth(new Date(Date.UTC(props.month.getUTCFullYear(), props.month.getUTCMonth() + 1)))} />
        </View>
    )
}


const styles = StyleSheet.create({
    monthSelectorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 25,
    },
    monthHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
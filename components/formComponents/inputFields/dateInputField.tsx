import React, { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View, StyleSheet } from "react-native";

interface DateInputFieldProps {
    date: Date | null
    setDate: (text: Date) => void
    placeholder?: string
}


export default function DateInputField(props: DateInputFieldProps) {
    
    const [show, setShow] = useState<boolean>(false)

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || props.date
        if (currentDate !== null) {props.setDate(currentDate)}
        setShow(false)
        
    }

    const togglePicker = () => {
        setShow(show === true ? false: true)
    }

    let text = "Date"
    if (props.placeholder) {text = props.placeholder}

    return (
        <View style={styles.dateFieldContainer}>
            <Text onPress={togglePicker}>{text}: {props.date === null ? "": props.date.toDateString()}</Text>
            {show && <DateTimePicker
                value={props.date || new Date()}
                onChange={handleDateChange}
                mode="date" 
                display="default"
            />}
        </View>
        
    )
}

const styles = StyleSheet.create({
    dateFieldContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        rowGap: 20,
    }
})
import React, { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View, StyleSheet } from "react-native";

interface DateInputFieldProps {
    date: Date
    setDate: (text: Date) => void
}


export default function DateInputField(props: DateInputFieldProps) {
    
    const [show, setShow] = useState<boolean>(false)

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || props.date
        props.setDate(currentDate)
        setShow(false)
        
    }

    const showPicker = () => {
        setShow(true)
    }

    return (
        <View style={styles.dateFieldContainer}>
            <Text onPress={showPicker}>Date: {props.date.toDateString()}</Text>
            {show && <DateTimePicker
                value={props.date}
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
        paddingLeft: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        rowGap: 20,
    }
})
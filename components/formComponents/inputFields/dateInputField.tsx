import React, { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View } from "react-native";

interface DateInputFieldProps {
    setDate: (text: string) => void
}


export default function DateInputField(props: DateInputFieldProps) {
    
    const [dateDisplayValue, setDate] = useState<Date>(new Date())
    const [show, setShow] = useState<boolean>(false)

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateDisplayValue
        setDate(currentDate)
        props.setDate(currentDate.toString())
        setShow(false)
        
    }

    const showPicker = () => {
        setShow(true)
    }

    return (
        <View style={{paddingVertical: 20, paddingLeft: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 10}}>
            <Text onPress={showPicker}>Date: {dateDisplayValue.toDateString()}</Text>
            {show && <DateTimePicker
                value={dateDisplayValue}
                onChange={handleDateChange}
                mode="date" 
                display="default"
            />}
        </View>
        
    )
}
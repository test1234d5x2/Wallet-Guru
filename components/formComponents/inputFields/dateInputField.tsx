import React, { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker';


interface DateInputFieldProps {
    setDate: (text: string) => void
}


export default function DateInputField(props: DateInputFieldProps) {
    
    const [dateDisplayValue, setDate] = useState<Date>(new Date())

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateDisplayValue
        setDate(currentDate)
        props.setDate(currentDate.toString())
    }

    return (
        <DateTimePicker
                value={dateDisplayValue}
                onChange={handleDateChange}
                mode="date" 
                display="default"
            />
    )
}
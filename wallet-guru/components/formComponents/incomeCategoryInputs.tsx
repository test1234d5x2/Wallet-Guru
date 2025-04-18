import React from 'react'
import { View, StyleSheet } from 'react-native'
import StandardInputField from './inputFields/standardInputField'
import ModalSelectionColours from '../modalSelection/modalSelectionColours'


interface IncomeCategoryInputs {
    categoryName: string,
    colour: string | null,
    colourChoices: string[],
    setCategoryName: (text: string) => void,
    setColour: (text: string) => void,
}


export default function IncomeCategoryInputs(props: IncomeCategoryInputs) {
    return (
        <View style={styles.container}>

            <StandardInputField
                value={props.categoryName}
                setValue={props.setCategoryName}
                placeholder="Category Name"
                required
            />

            <ModalSelectionColours choices={props.colourChoices} value={props.colour} setValue={props.setColour} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        rowGap: 20,
    },
})
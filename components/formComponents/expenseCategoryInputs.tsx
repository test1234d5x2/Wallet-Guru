import React from 'react';
import { View, StyleSheet } from 'react-native';
import StandardInputField from './inputFields/standardInputField';
import NumericInputField from './inputFields/numericInputField';

interface ExpenseCategoryInputs {
    categoryName: string,
    monthlyLimit: string,
    setCategoryName: (text: string) => void,
    setMonthlyLimit: (text: string) => void,

}


export default function ExpenseCategoryInputs(props: ExpenseCategoryInputs) {
    return (
        <View style={styles.container}>

            <StandardInputField
                value={props.categoryName}
                setValue={props.setCategoryName}
                placeholder="Category Name"
            />

            <NumericInputField
                value={props.monthlyLimit}
                placeholder="Monthly Limit"
                setValue={props.setMonthlyLimit}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        rowGap: 20,
    },
});
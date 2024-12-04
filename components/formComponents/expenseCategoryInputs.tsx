import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';


interface ExpenseCategoryInputs {
    categoryName: string,
    monthlyLimit: string,
    setCategoryName: (text: string) => void,
    setMonthlyLimit: (text: string) => void,

}


export default function ExpenseCategoryInputs(props: ExpenseCategoryInputs) {
    
    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Category Name"
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.categoryName}
                onChangeText={props.setCategoryName}
            />

            <TextInput
                style={styles.input}
                placeholder="Monthly Limit"
                placeholderTextColor={"rgba(0,0,0,0.25)"}
                value={props.monthlyLimit}
                keyboardType="numeric"
                onChangeText={props.setMonthlyLimit}
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
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
});
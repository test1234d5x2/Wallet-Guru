import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import IncomeCategory from '@/models/core/IncomeCategory'
import { useRouter } from 'expo-router'
import ListItemDeleteButton from './listItemDeleteButton'
import ListItemEditButton from './listItemEditButton'
import clearRouterHistory from '@/utils/clearRouterHistory'
import deleteIncomeCategory from '@/utils/apiCalls/deleteIncomeCategory'
import { StrongPill } from './categoryDisplayPills'

interface IncomeCategoryProps {
    category: IncomeCategory
    token: string
}

export default function IncomeCategoryItem(props: IncomeCategoryProps) {
    const router = useRouter();

    const handleEdit = (id: string) => {
        router.navigate(`/editIncomeCategoryPage/${props.category.getID()}`);
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Income Category', 'Are you sure you want to delete this Income category?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    deleteIncomeCategory(props.token, id).then((complete) => {
                        if (complete) {
                            Alert.alert('Success', 'Income category deleted successfully!');
                            clearRouterHistory(router);
                            router.replace("/incomeCategoriesOverviewPage");
                        }
                    }).catch((err: Error) => {
                        Alert.alert("Failed", "Failed to delete Income category.");
                        console.log(err.message);
                    })
                },
            },
        ]);
    };

    return (
        <View style={styles.categoryContainer}>
            <StrongPill colour={props.category.colour} text={props.category.name} />

            <View style={styles.actionsContainer}>
                <ListItemEditButton id={props.category.getID()} handleEdit={handleEdit} />
                <ListItemDeleteButton id={props.category.getID()} handleDelete={handleDelete} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        rowGap: 10,
    },
    label: {
        fontSize: 14,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

import ModalSelectionExpenseCategories from "@/components/modalSelection/modalSelectionExpenseCategories";
import setPageTitle from "@/components/pageTitle/setPageTitle";
import TopBar from "@/components/topBars/topBar";
import MonthSelector from "@/components/widgets/MonthSelector";
import Expense from "@/models/core/Expense";
import ExpenseCategory from "@/models/core/ExpenseCategory";
import getCategoryDistribution from "@/utils/analytics/getCategoryDistribution";
import getExpenseCategories from "@/utils/apiCalls/getExpenseCategories";
import getExpenses from "@/utils/apiCalls/getExpenses";
import calculateTransactionsTotalForTimeWindow from "@/utils/calculateTransactionsTotalForTimeWindow";
import clearRouterHistory from "@/utils/clearRouterHistory";
import computeWindowStartFromWindowEnd from "@/utils/computeTimeWindowStartFromNextTriggerDate";
import filterExpensesByCategory from "@/utils/filterExpensesByCategory";
import getEndOfMonth from "@/utils/getEndOfMonth";
import getStartOfMonth from "@/utils/getStartOfMonth";
import getToken from "@/utils/tokenAccess/getToken";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import * as Progress from 'react-native-progress';


export default function ExpenseCategoriesAnalytics() {
    setPageTitle('Expense Categories Analytics');

    const screenWidth = Dimensions.get('window').width;
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [month, setMonth] = useState<Date>(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth())));

    const [categorySelected, setCategorySelected] = useState<ExpenseCategory | null>(null);
    const [timeWindowStart, setTimeWindowStart] = useState<Date>();
    const [timeWindowEnd, setTimeWindowEnd] = useState<Date>();

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }
        setToken(data.token);
        setEmail(data.email);
    });

    useEffect(() => {
        async function getExpenseList() {
            const result = await getExpenses(token);
            if (result) {
                setExpenses(result);
            } else {
                console.log("Error with getting expense list");
            }
        }
        getExpenseList();
    }, [token]);

    useEffect(() => {
        async function getCategories() {
            const result = await getExpenseCategories(token);
            if (result) {
                setCategories(result);
            } else {
                console.log("Error with getting expense categories list.");
            }
        }
        getCategories();
    }, [token]);

    useEffect(() => {
        if (categorySelected) {
            const start = computeWindowStartFromWindowEnd(categorySelected.recurrenceRule.nextTriggerDate, categorySelected.recurrenceRule.frequency, categorySelected.recurrenceRule.interval);
            setTimeWindowStart(start);
            setTimeWindowEnd(categorySelected.recurrenceRule.nextTriggerDate);
        }
    }, [categorySelected]);

    const handlePrevWindow = () => {
        if (timeWindowStart && categorySelected) {
            const newWindowEnd = timeWindowStart;
            const newWindowStart = computeWindowStartFromWindowEnd(newWindowEnd, categorySelected.recurrenceRule.frequency, categorySelected.recurrenceRule.interval);
            setTimeWindowStart(newWindowStart);
            setTimeWindowEnd(newWindowEnd);
        }
    };

    const handleNextWindow = () => {
        if (categorySelected) {
            const defaultWindowEnd = categorySelected.recurrenceRule.nextTriggerDate;
            const defaultWindowStart = computeWindowStartFromWindowEnd(defaultWindowEnd, categorySelected.recurrenceRule.frequency, categorySelected.recurrenceRule.interval);
            setTimeWindowStart(defaultWindowStart);
            setTimeWindowEnd(defaultWindowEnd);
        }
    };

    const getColor = (index: number) => {
        const colors = ['#C0C0C0', '#A9A9A9', '#E5E5E5', '#696969', '#000000'];
        return colors[index % colors.length];
    };

    const categoryTotals = getCategoryDistribution(expenses, categories, getStartOfMonth(month), getEndOfMonth(month));
    const categoryDistribution = categoryTotals.map(({ name, total }, index) => ({
        name,
        population: total,
        color: getColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    let budgetComparisonDisplay = null;
    if (categorySelected && timeWindowStart && timeWindowEnd) {
        const totalSpent = calculateTransactionsTotalForTimeWindow(filterExpensesByCategory(expenses, categorySelected), timeWindowStart, timeWindowEnd);
        const percentageUsed = Math.min((totalSpent / categorySelected.monthlyBudget) * 100, 100);

        budgetComparisonDisplay = (
            <View style={styles.budgetAnalyticsContainer}>
                <Text style={styles.analyticsHeader}>
                    {categorySelected.name} Budget vs. Actual
                </Text>
                <View style={styles.timeWindowSelector}>
                    <Ionicons name="arrow-back" size={24} color="black" onPress={handlePrevWindow} />
                    <Text style={styles.timeWindowText}>
                        {`${timeWindowStart.toLocaleDateString()} - ${timeWindowEnd.toLocaleDateString()}`}
                    </Text>
                    <Ionicons name="arrow-forward" size={24} color="black" onPress={handleNextWindow} />
                </View>
                <Text style={styles.infoText}>
                    {`Spent: £${totalSpent.toFixed(2)} / Budget: £${categorySelected.monthlyBudget.toFixed(2)}`}
                </Text>
                <Progress.Bar progress={percentageUsed / 100} width={screenWidth - 50} height={20} color="#4CAF50" unfilledColor="#eee" borderWidth={0} style={{ marginVertical: 10 }} />
                <Text style={styles.percentageText}>{`${percentageUsed.toFixed(0)}% of budget used`}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView contentContainerStyle={styles.mainContent} style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
                <View style={styles.categoryDistributionSection}>
                    <MonthSelector month={month} setMonth={setMonth} />
                    <Text style={styles.sectionHeader}>Category Distribution:</Text>
                    {categoryDistribution.filter((distribution) => distribution.population !== 0).length === 0 ? (<Text style={styles.message}>There were no expenses.</Text>) : (
                        <PieChart
                            data={categoryDistribution}
                            width={screenWidth - 50}
                            height={250}
                            chartConfig={{
                                backgroundGradientFrom: '#fff',
                                backgroundGradientTo: '#fff',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                        />
                    )}
                </View>

                <View style={styles.selectionSection}>
                    <ModalSelectionExpenseCategories choices={categories} value={categorySelected} setValue={setCategorySelected} />
                    {budgetComparisonDisplay || <Text style={styles.message}>Please select a category.</Text>}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    mainContent: {
        paddingBottom: 40,
        rowGap: 50,
    },
    categoryDistributionSection: {
        rowGap: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    message: {
        textAlign: "center",
        fontSize: 16,
    },
    selectionSection: {
        rowGap: 20,
    },
    budgetAnalyticsContainer: {
        padding: 10,
    },
    analyticsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center",
    },
    timeWindowSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 10,
        marginBottom: 10,
    },
    timeWindowText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 5,
    },
    percentageText: {
        marginTop: 5,
        fontWeight: '500',
        textAlign: 'center',
    },
});

import ModalSelectionExpenseCategories from "@/components/modalSelection/modalSelectionCategories"
import setPageTitle from "@/components/pageTitle/setPageTitle"
import TopBar from "@/components/topBars/topBar"
import MonthSelector from "@/components/widgets/MonthSelector"
import Expense from "@/models/core/Expense"
import ExpenseCategory from "@/models/core/ExpenseCategory"
import getExpenseCategories from "@/utils/apiCalls/getExpenseCategories"
import getExpenses from "@/utils/apiCalls/getExpenses"
import clearRouterHistory from "@/utils/clearRouterHistory"
import computeWindowStartFromWindowEnd from "@/utils/computeTimeWindowStartFromNextTriggerDate"
import getToken from "@/utils/tokenAccess/getToken"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, Dimensions, ScrollView, View, Text, StyleSheet, StatusBar } from "react-native"
import { PieChart } from "react-native-chart-kit"

export default function ExpenseCategoriesAnalytics() {
    setPageTitle('Expense Categories Analytics')

    const screenWidth = Dimensions.get('window').width
    const router = useRouter()
    const [token, setToken] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    
    const [categories, setCategories] = useState<ExpenseCategory[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [month, setMonth] = useState<Date>(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth())))

    const [categorySelected, setCategorySelected] = useState<ExpenseCategory | null>(null)
    const [timeWindowStart, setTimeWindowStart] = useState<Date>()
    const [timeWindowEnd, setTimeWindowEnd] = useState<Date>()

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page')
            clearRouterHistory(router)
            router.replace("/loginPage")
            return
        }
        setToken(data.token)
        setEmail(data.email)
    })

    useEffect(() => {
        async function getExpenseList() {
            const result = await getExpenses(token)
            if (result) {
                setExpenses(result)
            } else {
                console.log("Error with getting expense list")
            }
        }
        getExpenseList()
    }, [token])

    useEffect(() => {
        async function getCategories() {
            const result = await getExpenseCategories(token)
            if (result) {
                setCategories(result)
            } else {
                console.log("Error with getting expense categories list.")
            }
        }
        getCategories()
    }, [token])

    useEffect(() => {
        if (categorySelected) {
            const start = computeWindowStartFromWindowEnd(categorySelected.recurrenceRule.nextTriggerDate, categorySelected.recurrenceRule.frequency, categorySelected.recurrenceRule.interval)
            setTimeWindowStart(start)
            setTimeWindowEnd(categorySelected.recurrenceRule.nextTriggerDate)
        }
    }, [categorySelected])

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} />
            <TopBar />
            <ScrollView contentContainerStyle={styles.mainContent} style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
                <View style={styles.categoryDistributionSection}>
                    <MonthSelector month={month} setMonth={setMonth} />
                    <Text style={styles.sectionHeader}>Category Distribution:</Text>
                    <PieChart
                        data={[]}
                        width={screenWidth - 50}
                        height={250}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                    />
                </View>
                <View style={styles.selectionSection}>
                    <ModalSelectionExpenseCategories choices={categories} value={categorySelected} setValue={setCategorySelected} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1
    },
    mainContent: {
        paddingBottom: 40,
        rowGap: 50
    },
    categoryDistributionSection: {
        rowGap: 20
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    selectionSection: {
        rowGap: 20
    }
})

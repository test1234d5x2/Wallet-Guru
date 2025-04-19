import Expense from '@/models/core/Expense'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import IncomeCategory from '@/models/core/IncomeCategory'
import Transaction from '@/models/core/Transaction'
import * as FileSystem from 'expo-file-system'


function isExpense(tx: Transaction): tx is Expense {
    return 'receipt' in tx
}


export async function generateCSV(transactions: Transaction[], expenseCategoriesList: ExpenseCategory[], incomeCategoriesList: IncomeCategory[], filename: string) {
    const formatDate = (dt: Date): string => {
        const mm = String(dt.getMonth() + 1).padStart(2, '0')
        const dd = String(dt.getDate()).padStart(2, '0')
        const yyyy = dt.getFullYear()
        return `${mm}/${dd}/${yyyy}`
    }

    const header = ['Date', 'Title', 'Category', 'Notes', 'Amount']
    const escape = (value: string): string => `"${value.replace(/"/g, '""')}"`

    const rows = transactions.map(tx => {
        let categoryName

        if (isExpense(tx)) {
            categoryName = expenseCategoriesList.find(cat => cat.getID() === tx.categoryID)?.name || ''
        }
        else {
            categoryName = incomeCategoriesList.find(cat => cat.getID() === tx.categoryID)?.name || ''
        }

        const row = [
            formatDate(tx.date),
            tx.title,
            categoryName,
            tx.notes,
            tx.amount.toString()
        ].map(escape)
        return row.join(',')
    })

    const csvContent = [header.map(escape).join(','), ...rows].join('\n') + '\n'
    try {
        const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
        if (perm.granted && perm.directoryUri) {
            const uri = await FileSystem.StorageAccessFramework.createFileAsync(
                perm.directoryUri,
                filename,
                'application/x-qif'
            )
            await FileSystem.StorageAccessFramework.writeAsStringAsync(
                uri,
                csvContent,
                { encoding: FileSystem.EncodingType.UTF8 }
            )
            return uri
        }
    } catch (e) {
        console.warn('Error requesting directory or writing file:', e)
    }
}
import * as FileSystem from 'expo-file-system'
import Expense from '@/models/core/Expense'
import Transaction from '@/models/core/Transaction'
import ExpenseCategory from '@/models/core/ExpenseCategory'
import IncomeCategory from '@/models/core/IncomeCategory'
import Income from '@/models/core/Income'


function isExpense(tx: Transaction): tx is Expense {
    return 'receipt' in tx
}

export async function generateQIF(transactions: Transaction[], expenseCategoriesList: ExpenseCategory[], incomeCategoriesList: IncomeCategory[], filename: string, accountType = 'Bank') {
    const lines: string[] = []
    lines.push(`!Type:${accountType}`)

    console.log("Here")

    const formatDate = (dt: Date): string => {
        const mm = String(dt.getMonth() + 1).padStart(2, '0')
        const dd = String(dt.getDate()).padStart(2, '0')
        const yyyy = dt.getFullYear()
        return `${mm}/${dd}/${yyyy}`
    }

    for (const tx of transactions) {
        lines.push(`D${formatDate(tx.date)}`)
        lines.push(`T${tx.amount}`)
        lines.push(`P${tx.title}`)

        if (isExpense(tx)) {
            lines.push(`L${expenseCategoriesList.find(cat => cat.getID() === tx.categoryID)?.name || ''}`)
        }
        else {
            lines.push(`L${incomeCategoriesList.find(cat => cat.getID() === (tx as Income).categoryID)?.name || ''}`)
        }


        if (tx.notes) lines.push(`M${tx.notes}`)
        lines.push('^')
    }

    console.log(lines)
    const content = lines.join('\n') + '\n'
    
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
                content,
                { encoding: FileSystem.EncodingType.UTF8 }
            )
            return uri
        }
    } catch (e) {
        console.warn('Error requesting directory or writing file:', e)
    }
}

// Example usage:
// const fileUri = await generateQIF(
//   allTransactions,
//   { [expenseCat1.getID()]: 'Groceries', [expenseCat2.getID()]: 'Rent' },
//   { [incomeCat1.getID()]: 'Income:Salary' },
//   'personal_expenses.qif'
// )
// console.log('QIF saved to', fileUri)

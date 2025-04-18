import Transaction from '@/models/core/Transaction'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'


/**
 * Generate a CSV file from transactions, save it, and prompt the share sheet
 *
 * @param transactions - Array of Transaction items
 * @param categoryMap - Map of categoryID to human-readable category name
 * @param filename - Output filename (e.g. 'export.csv')
 * @returns URI where the CSV was saved
 */
export async function generateCSV(transactions: Transaction[],categoryMap: Record<string, string>,filename: string): Promise<string> {
    const formatDate = (dt: Date): string => {
        const mm = String(dt.getMonth() + 1).padStart(2, '0')
        const dd = String(dt.getDate()).padStart(2, '0')
        const yyyy = dt.getFullYear()
        return `${mm}/${dd}/${yyyy}`
    }

    const header = ['Date', 'Title', 'Category', 'Notes', 'Amount']
    const escape = (value: string): string => `"${value.replace(/"/g, '""')}"`

    const rows = transactions.map(tx => {
        const row = [
            formatDate(tx.date),
            tx.title,
            categoryMap[tx.categoryID] ?? '',
            tx.notes,
            tx.amount.toString()
        ].map(escape)
        return row.join(',')
    })

    const csvContent = [header.map(escape).join(','), ...rows].join('\n') + '\n'

    const fileUri = FileSystem.documentDirectory + filename
    await FileSystem.writeAsStringAsync(
        fileUri,
        csvContent,
        { encoding: FileSystem.EncodingType.UTF8 }
    )

    return fileUri
}
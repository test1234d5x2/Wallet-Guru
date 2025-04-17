import Income from "@/models/core/Income"
import IncomeCategory from "@/models/core/IncomeCategory"

export default function filterIncomesByCategory<T extends Income>(incomes: T[], category: IncomeCategory): T[] {
    return incomes.filter(income => income.categoryID === category.getID())
}

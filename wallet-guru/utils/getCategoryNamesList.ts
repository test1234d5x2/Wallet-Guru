import ExpenseCategory from "@/models/core/ExpenseCategory";

export default function getCategoryNamesList(categories: ExpenseCategory[]): string[] {
    return categories.map((cat) => cat.name);
}
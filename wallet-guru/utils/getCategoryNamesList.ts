import ExpenseCategory from "@/models/ExpenseCategory";

export default function getCategoryNamesList(categories: ExpenseCategory[]): string[] {
    return categories.map((cat) => cat.name);
}
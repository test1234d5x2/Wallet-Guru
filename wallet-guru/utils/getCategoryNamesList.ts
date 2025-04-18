import Category from "@/models/core/Category";

export default function getCategoryNamesList(categories: Category[]): string[] {
    return categories.map((cat) => cat.name);
}
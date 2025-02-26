import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/Expense";
import userRoutes from "./routes/User";
import expenseCategoryRoutes from "./routes/ExpenseCategory";
import incomeRoutes from "./routes/Income";
import goalRoutes from "./routes/Goal";
import recurringExpenseRouter from "./routes/RecurringExpense";
import recurringIncomeRouter from "./routes/RecurringIncome";

dotenv.config();

const app = express();

let tempPort = 5005;
if (process.env.PORT) {
    tempPort = parseInt(process.env.PORT);
}

let tempIP = 'localhost';
if (process.env.IP) {tempIP = process.env.IP}

const IP = tempIP;
const PORT = tempPort;


app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/recurring-expenses", recurringExpenseRouter);
app.use("/api/recurring-incomes", recurringIncomeRouter )

app.listen(PORT, IP, () => console.log(`Server running on  https://${IP}:${PORT}`));

export default app;

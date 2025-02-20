import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/ExpenseCategory";
import userRoutes from "./routes/User";
import expenseCategoryRoutes from "./routes/ExpenseCategory";
import incomeRoutes from "./routes/Income";
import goalRoutes from "./routes/Goal";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/goals", goalRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;

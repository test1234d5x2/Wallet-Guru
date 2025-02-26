import ExpenseService from "../services/ExpenseService";
import IncomeService from "../services/IncomeService";
import GoalService from "../services/GoalService";
import UserService from "../services/UserService";
import ExpenseCategoryService from "../services/ExpenseCategoryService";
import RecurringExpenseService from "../services/RecurringExpenseService";
import RecurringIncomeService from "../services/RecurringIncomeService";
import Connection from "../gRPC/init";

class Registry {
    private static instance: Registry;
    private connection: Connection;

    public expenseService!: ExpenseService;
    public incomeService!: IncomeService;
    public goalService!: GoalService;
    public userService!: UserService;
    public expenseCategoryService!: ExpenseCategoryService;
    public recurringExpenseService!: RecurringExpenseService;
    public recurringIncomeService!: RecurringIncomeService;

    private constructor() {
        this.connection = Connection.getInstance();
    }

    public static async getInstance(): Promise<Registry> {
        if (!Registry.instance) {
            Registry.instance = new Registry();
            await Registry.instance.init();
        }
        return Registry.instance;
    }

    private async init(): Promise<void> {
        await this.connection.connect();

        const userContract = this.connection.getUserContract();
        const expenseContract = this.connection.getExpenseContract();
        const expenseCategoryContract = this.connection.getExpenseCategoryContract();
        const incomeContract = this.connection.getIncomeContract();
        const goalContract = this.connection.getGoalContract();
        const recurringIncomeContract = this.connection.getRecurringIncomeContract();
        const recurringExpenseContract = this.connection.getRecurringExpenseContract();

        this.userService = new UserService(userContract);
        this.expenseService = new ExpenseService(expenseContract);
        this.incomeService = new IncomeService(incomeContract);
        this.goalService = new GoalService(goalContract);
        this.expenseCategoryService = new ExpenseCategoryService(expenseCategoryContract);
        this.recurringExpenseService = new RecurringExpenseService(this.expenseService, recurringExpenseContract);
        this.recurringIncomeService = new RecurringIncomeService(this.incomeService, recurringIncomeContract);
    }
}

export default Registry;

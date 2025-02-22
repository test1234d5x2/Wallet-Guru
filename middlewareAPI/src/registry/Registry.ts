import ExpenseService from "../services/ExpenseService";
import IncomeService from "../services/IncomeService";
import GoalService from "../services/GoalService";
import UserService from "../services/UserService";
import ExpenseCategoryService from "../services/ExpenseCategoryService";
import AuthService from "../services/AuthService";

class Registry {
    private static instance: Registry;

    public expenseService: ExpenseService;
    public incomeService: IncomeService;
    public goalService: GoalService;
    public userService: UserService;
    public expenseCategoryService: ExpenseCategoryService;
    public authService: AuthService;

    private constructor() {
        this.userService = new UserService();
        this.expenseService = new ExpenseService();
        this.incomeService = new IncomeService();
        this.goalService = new GoalService();
        this.expenseCategoryService = new ExpenseCategoryService();
        this.authService = new AuthService(this.userService);

    }

    public static getInstance(): Registry {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }
        return Registry.instance;
    }
}

export default Registry;

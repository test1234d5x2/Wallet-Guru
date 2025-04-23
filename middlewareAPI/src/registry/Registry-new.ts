import { GatewayManager } from "../gRPC/init-new";
import ExpenseService from "../services/ExpenseService";
import ExpenseCategoryService from "../services/ExpenseCategoryService";
import GoalService from "../services/GoalService";
import IncomeCategoryService from "../services/IncomeCategoryService";
import IncomeService from "../services/IncomeService";
import RecurringExpenseService from "../services/RecurringExpenseService";
import RecurringIncomeService from "../services/RecurringIncomeService";
import UserService from "../services/UserService";

export default class Registry {
    private static instance: Registry;
    private gatewayManager: GatewayManager;

    public expenseService!: ExpenseService
    public incomeService!: IncomeService
    public goalService!: GoalService
    public userService!: UserService
    public expenseCategoryService!: ExpenseCategoryService
    public incomeCategoryService!: IncomeCategoryService
    public recurringExpenseService!: RecurringExpenseService
    public recurringIncomeService!: RecurringIncomeService

    private constructor() {
        this.gatewayManager = new GatewayManager();

        this.userService = new UserService(this.gatewayManager)
        this.expenseService = new ExpenseService(this.gatewayManager)
        this.incomeService = new IncomeService(this.gatewayManager)
        this.goalService = new GoalService(this.gatewayManager)
        this.expenseCategoryService = new ExpenseCategoryService(this.gatewayManager)
        this.incomeCategoryService = new IncomeCategoryService(this.gatewayManager)
        this.recurringExpenseService = new RecurringExpenseService(this.expenseService, this.gatewayManager)
        this.recurringIncomeService = new RecurringIncomeService(this.incomeService, this.gatewayManager)
    }

    public static getInstance(): Registry {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }
        return Registry.instance;
    }
}
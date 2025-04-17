/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {type Contract} from 'fabric-contract-api'
import { UserContract } from './User'
import { ExpenseContract } from './Expense'
import { ExpenseCategoryContract } from './ExpenseCategory'
import { IncomeCategoryContract } from './IncomeCategory'
import { IncomeContract } from './Income'
import { GoalContract } from './Goal'
import { RecurringExpenseContract } from './RecurringExpense'
import { RecurringIncomeContract } from './RecurringIncome'

export const contracts: typeof Contract[] = [UserContract, ExpenseContract, ExpenseCategoryContract, IncomeContract, GoalContract, RecurringExpenseContract, RecurringIncomeContract, IncomeCategoryContract]
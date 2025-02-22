/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {type Contract} from 'fabric-contract-api';
import { UserContract } from './User';
import { ExpenseContract } from './Expense';
import { ExpenseCategoryContract } from './ExpenseCategory';
import { IncomeContract } from './Income';
import { GoalContract } from './Goal';

export const contracts: typeof Contract[] = [UserContract, ExpenseContract, ExpenseCategoryContract, IncomeContract, GoalContract];

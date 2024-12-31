import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Expense from '@/models/Expense';
import { Alert } from 'react-native';
import ExpenseCategory from '@/models/ExpenseCategory';
import User from '@/models/User';
import ExpenseItem from '@/components/listItems/expenseItem';


jest.mock("expo-font");


const mockRouter = {
    navigate: jest.fn(),
    replace: jest.fn(),
};

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
}));


jest.spyOn(Alert, 'alert');


const mockCategory = new ExpenseCategory(new User("", ""), 'Test Category', 200, 500);
const mockExpense = new Expense(new User("", ""), 'Lunch', -15.5, new Date(), "", mockCategory);
mockExpense.getID = jest.fn(() => '1');
mockExpense.getEditURL = jest.fn(() => '/editExpensePage');

// Test suite
describe('ExpenseItem Component', () => {

    it('renders correctly', () => {
        const { getByText } = render(<ExpenseItem expense={mockExpense} />);

        expect(getByText('Lunch')).toBeTruthy();
        expect(getByText('Category: Test Category')).toBeTruthy();
        expect(getByText('-£15.50')).toBeTruthy();
    });

    it('navigates to edit page when edit button is pressed', () => {
        const { getByTestId } = render(<ExpenseItem expense={mockExpense} />);

        const editButton = getByTestId('edit-button');
        fireEvent.press(editButton);

        expect(mockRouter.navigate).toHaveBeenCalledWith('/editExpensePage');
    });

    it('shows delete confirmation and deletes when confirmed', () => {
        const { getByTestId } = render(<ExpenseItem expense={mockExpense} />);

        const deleteButton = getByTestId('delete-button');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            expect.any(Array)
        );

        // Simulate pressing delete in the alert
        const deleteAction = Alert.alert.mock.calls[0][2][1];
        deleteAction.onPress();

        expect(mockRouter.replace).toHaveBeenCalledWith('/listTransactionsPage');
    });
});

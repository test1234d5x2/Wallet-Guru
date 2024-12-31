import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExpenseCategoryItem from '@/components/listItems/expenseCategoryItem';
import ExpenseCategory from '@/models/ExpenseCategory';
import { Alert } from 'react-native';
import User from '@/models/User';

jest.mock("expo-font");

// Mock router
const mockRouter = {
    navigate: jest.fn(),
    replace: jest.fn(),
};

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
}));

// Mock alert
jest.spyOn(Alert, 'alert');

// Mock category
const mockCategory = new ExpenseCategory(new User("", ""), 'Test Category', 200, 500);
mockCategory.getID = jest.fn(() => '123');
mockCategory.calculateBudgetUsed = jest.fn(() => 0.4);

// Test suite
describe('ExpenseCategoryItem Component', () => {

    it('renders correctly', () => {
        const { getByText } = render(<ExpenseCategoryItem category={mockCategory} />);

        expect(getByText('Test Category')).toBeTruthy();
        expect(getByText('Spending: £200')).toBeTruthy();
        expect(getByText('Budget: £500')).toBeTruthy();
    });

    it('navigates to edit page when edit button is pressed', () => {
        const { getByTestId } = render(<ExpenseCategoryItem category={mockCategory} />);

        const editButton = getByTestId('edit-button');
        fireEvent.press(editButton);

        expect(mockRouter.navigate).toHaveBeenCalledWith('/editExpenseCategoryPage');
    });

    it('shows delete confirmation and deletes when confirmed', () => {
        const { getByTestId } = render(<ExpenseCategoryItem category={mockCategory} />);

        const deleteButton = getByTestId('delete-button');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Expense Category',
            'Are you sure you want to delete this expense category?',
            expect.any(Array)
        );

        // Simulate pressing delete in the alert
        const deleteAction = Alert.alert.mock.calls[0][2][1];
        deleteAction.onPress();

        expect(mockRouter.replace).toHaveBeenCalledWith('/expenseCategoriesOverviewPage');
    });
});

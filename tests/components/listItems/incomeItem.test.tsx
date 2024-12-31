import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Income from '@/models/Income';
import { Alert } from 'react-native';
import IncomeItem from '@/components/listItems/incomeItem';
import User from '@/models/User';


jest.mock("expo-font");


const mockRouter = {
    navigate: jest.fn(),
    replace: jest.fn(),
};

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
}));


jest.spyOn(Alert, 'alert');


const mockIncome = new Income(new User("", ""), 'Salary', 1500, new Date(), "");
mockIncome.getID = jest.fn(() => '1');
mockIncome.getEditURL = jest.fn(() => '/editIncomePage');

// Test suite
describe('IncomeItem Component', () => {

    it('renders correctly', () => {
        const { getByText } = render(<IncomeItem income={mockIncome} />);

        expect(getByText('Salary')).toBeTruthy();
        expect(getByText('+£1500')).toBeTruthy();
    });

    it('navigates to edit page when edit button is pressed', () => {
        const { getByTestId } = render(<IncomeItem income={mockIncome} />);

        const editButton = getByTestId('edit-button');
        fireEvent.press(editButton);

        expect(mockRouter.navigate).toHaveBeenCalledWith('/editIncomePage');
    });

    it('shows delete confirmation and deletes when confirmed', () => {
        const { getByTestId } = render(<IncomeItem income={mockIncome} />);

        const deleteButton = getByTestId('delete-button');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Income',
            'Are you sure you want to delete this income source?',
            expect.any(Array)
        );

        // Simulate pressing delete in the alert
        const deleteAction = Alert.alert.mock.calls[0][2][1];
        deleteAction.onPress();

        expect(mockRouter.replace).toHaveBeenCalledWith('/listTransactionsPage');
    });
});

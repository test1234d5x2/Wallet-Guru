import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import User from '@/models/User';
import GoalStatus from '@/enums/GoalStatus';
import GoalItem from '@/components/listItems/goalItem';
import Goal from '@/models/Goal';


jest.mock("expo-font");


const mockRouter = {
    navigate: jest.fn(),
    replace: jest.fn(),
};

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
}));


jest.spyOn(Alert, 'alert');


const mockGoal = new Goal('Save for Vacation', new User("", ""), "", 1000, GoalStatus.Active);
mockGoal.getID = jest.fn(() => '1');
mockGoal.calculateProgress = jest.fn(() => 0.5);

// Test suite
describe('GoalItem Component', () => {

    it('renders correctly', () => {
        const { getByText } = render(<GoalItem goal={mockGoal} />);

        expect(getByText('Save for Vacation')).toBeTruthy();
        expect(getByText('Target: £1000')).toBeTruthy();
        expect(getByText('Progress')).toBeTruthy();
    });

    it('navigates to update page when edit button is pressed', () => {
        const { getByTestId } = render(<GoalItem goal={mockGoal} />);

        const editButton = getByTestId('edit-button');
        fireEvent.press(editButton);

        expect(mockRouter.navigate).toHaveBeenCalledWith('/updateGoalPage');
    });

    it('shows delete confirmation and deletes when confirmed', () => {
        const { getByTestId } = render(<GoalItem goal={mockGoal} />);

        const deleteButton = getByTestId('delete-button');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Goal',
            'Are you sure you want to delete this goal?',
            expect.any(Array)
        );

        // Simulate pressing delete in the alert
        const deleteAction = Alert.alert.mock.calls[0][2][1];
        deleteAction.onPress();

        expect(mockRouter.replace).toHaveBeenCalledWith('/allGoalsPage');
    });
});

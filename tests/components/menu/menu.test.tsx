import React from 'react';
import { render } from '@testing-library/react-native';
import MainMenu from '@/components/menuComponents/menu';


describe('MainMenu Component', () => {

    it('renders correctly', () => {
        const { getByText } = render(<MainMenu />);

        expect(getByText('Add Expense')).toBeTruthy();
        expect(getByText('Add Income')).toBeTruthy();
        expect(getByText('Transaction History')).toBeTruthy();
        expect(getByText('Create A New Goal')).toBeTruthy();
        expect(getByText('View Goals')).toBeTruthy();
        expect(getByText('Create An Expense Category')).toBeTruthy();
        expect(getByText('Expense Category Overview')).toBeTruthy();
        expect(getByText('Dashboard')).toBeTruthy();
        expect(getByText('Spending Analytics')).toBeTruthy();
    });

    it('renders the correct number of menu items', () => {
        const { getAllByText } = render(<MainMenu />);

        const menuItems = getAllByText(/.*/); // Match all rendered text
        expect(menuItems.length).toBe(9);
    });

    it('passes correct props to each MenuItem', () => {
        const { getByText } = render(<MainMenu />);

        const expectedMenuItems = [
            'Add Expense',
            'Add Income',
            'Transaction History',
            'Create A New Goal',
            'View Goals',
            'Create An Expense Category',
            'Expense Category Overview',
            'Dashboard',
            'Spending Analytics'
        ];

        expectedMenuItems.forEach((item) => {
            expect(getByText(item)).toBeTruthy();
        });
    });

});

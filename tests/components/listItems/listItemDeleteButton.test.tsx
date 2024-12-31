import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ListItemDeleteButton from '@/components/listItems/listItemDeleteButton';


jest.mock("expo-font");


const mockHandleDelete = jest.fn();
const mockId = '456';


describe('ListItemDeleteButton Component', () => {

    it('renders correctly', () => {
        const { getByTestId } = render(
            <ListItemDeleteButton id={mockId} handleDelete={mockHandleDelete} />
        );

        const button = getByTestId('delete-button');
        expect(button).toBeTruthy();
    });

    it('calls handleDelete with the correct id when pressed', () => {
        const { getByTestId } = render(
            <ListItemDeleteButton id={mockId} handleDelete={mockHandleDelete} />
        );

        const button = getByTestId('delete-button');
        fireEvent.press(button);

        expect(mockHandleDelete).toHaveBeenCalledTimes(1);
        expect(mockHandleDelete).toHaveBeenCalledWith(mockId);
    });

});

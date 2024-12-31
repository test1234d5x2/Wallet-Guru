import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ListItemEditButton from '@/components/listItems/listItemEditButton';

jest.mock("expo-font");


const mockHandleEdit = jest.fn();
const mockId = '123';


describe('ListItemEditButton Component', () => {

    it('renders correctly', () => {
        const { getByTestId } = render(
            <ListItemEditButton id={mockId} handleEdit={mockHandleEdit} />
        );

        const button = getByTestId('edit-button');
        expect(button).toBeTruthy();
    });

    it('calls handleEdit with the correct id when pressed', () => {
        const { getByTestId } = render(
            <ListItemEditButton id={mockId} handleEdit={mockHandleEdit} />
        );

        const button = getByTestId('edit-button');
        fireEvent.press(button);

        expect(mockHandleEdit).toHaveBeenCalledTimes(1);
        expect(mockHandleEdit).toHaveBeenCalledWith(mockId);
    });

});

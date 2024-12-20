import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StandardInputField from '@/components/formComponents/inputFields/standardInputField';


describe('StandardInputField Component', () => {
    const mockSetValue = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component correctly with placeholder', () => {
        const { getByPlaceholderText } = render(
            <StandardInputField value="" placeholder="Enter text" setValue={mockSetValue} />
        );

        const input = getByPlaceholderText("Enter text");
        expect(input).toBeTruthy();
    });

    it('displays the correct value', () => {
        const value = "Test Value";
        const { getByDisplayValue } = render(
            <StandardInputField value={value} placeholder="Enter text" setValue={mockSetValue} />
        );

        const input = getByDisplayValue(value);
        expect(input).toBeTruthy();
    });

    it('calls setValue when text is changed', () => {
        const { getByPlaceholderText } = render(
            <StandardInputField value="" placeholder="Enter text" setValue={mockSetValue} />
        );

        const input = getByPlaceholderText("Enter text");
        fireEvent.changeText(input, "New Value");

        expect(mockSetValue).toHaveBeenCalledWith("New Value");
    });
});
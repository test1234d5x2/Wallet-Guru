import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NumericInputField from '@/components/formComponents/inputFields/numericInputField';


describe('NumericInputField Component', () => {
    const mockSetValue = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component correctly with placeholder', () => {
        const { getByPlaceholderText } = render(
            <NumericInputField value="" placeholder="Enter number" setValue={mockSetValue} />
        );

        const input = getByPlaceholderText("Enter number");
        expect(input).toBeTruthy();
    });

    it('displays the correct numeric value', () => {
        const value = "123.45";
        const { getByDisplayValue } = render(
            <NumericInputField value={value} placeholder="Enter number" setValue={mockSetValue} />
        );

        const input = getByDisplayValue(value);
        expect(input).toBeTruthy();
    });

    it('calls setValue when text is changed', () => {
        const { getByPlaceholderText } = render(
            <NumericInputField value="" placeholder="Enter number" setValue={mockSetValue} />
        );

        const input = getByPlaceholderText("Enter number");
        fireEvent.changeText(input, "678.90");

        expect(mockSetValue).toHaveBeenCalledWith("678.90");
    });

    it('has the correct keyboard type set', () => {
        const { getByPlaceholderText } = render(
            <NumericInputField value="" placeholder="Enter number" setValue={mockSetValue} />
        );

        const input = getByPlaceholderText("Enter number");
        expect(input.props.keyboardType).toBe("decimal-pad");
    });
});

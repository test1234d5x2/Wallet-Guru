import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmailInputField from '@/components/formComponents/inputFields/emailInputField';


describe('EmailInputField Component', () => {
    const mockSetEmail = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component correctly', () => {
        const { getByPlaceholderText } = render(
            <EmailInputField email="" setEmail={mockSetEmail} />
        );

        const input = getByPlaceholderText("Email");
        expect(input).toBeTruthy();
    });

    it('displays the correct email value', () => {
        const email = "test@example.com";
        const { getByDisplayValue } = render(
            <EmailInputField email={email} setEmail={mockSetEmail} />
        );

        const input = getByDisplayValue(email);
        expect(input).toBeTruthy();
    });

    it('calls setEmail when text is changed', () => {
        const { getByPlaceholderText } = render(
            <EmailInputField email="" setEmail={mockSetEmail} />
        );

        const input = getByPlaceholderText("Email");
        fireEvent.changeText(input, "newemail@example.com");

        expect(mockSetEmail).toHaveBeenCalledWith("newemail@example.com");
    });

    it('has the correct keyboard type set', () => {
        const { getByPlaceholderText } = render(
            <EmailInputField email="" setEmail={mockSetEmail} />
        );

        const input = getByPlaceholderText("Email");
        expect(input.props.keyboardType).toBe("email-address");
    });
});

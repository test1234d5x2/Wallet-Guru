import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PasswordInputField from '@/components/formComponents/inputFields/passwordInputField';

describe('PasswordInputField Component', () => {
    const mockSetPassword = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component correctly with placeholder', () => {
        const { getByPlaceholderText } = render(
            <PasswordInputField password="" setPassword={mockSetPassword} />
        );

        const input = getByPlaceholderText("Password");
        expect(input).toBeTruthy();
    });

    it('displays the correct password value', () => {
        const password = "mypassword";
        const { getByDisplayValue } = render(
            <PasswordInputField password={password} setPassword={mockSetPassword} />
        );

        const input = getByDisplayValue(password);
        expect(input).toBeTruthy();
    });

    it('calls setPassword when text is changed', () => {
        const { getByPlaceholderText } = render(
            <PasswordInputField password="" setPassword={mockSetPassword} />
        );

        const input = getByPlaceholderText("Password");
        fireEvent.changeText(input, "newpassword");

        expect(mockSetPassword).toHaveBeenCalledWith("newpassword");
    });

    it('hides the password input by default', () => {
        const { getByPlaceholderText } = render(
            <PasswordInputField password="" setPassword={mockSetPassword} />
        );

        const input = getByPlaceholderText("Password");
        expect(input.props.secureTextEntry).toBe(true);
    });
});

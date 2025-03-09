import React from 'react';
import { View, StyleSheet } from 'react-native';
import PasswordInputField from './inputFields/passwordInputField';

interface ChangePasswordInputsProps {
    oldPassword: string,
    newPassword: string,
    verifyNewPassword: string,
    setOldPassword: (text: string) => void,
    setNewPassword: (text: string) => void,
    setVerification: (text: string) => void,

}

export default function ChangePasswordInputs(props: ChangePasswordInputsProps) {
    return (
        <View style={styles.container}>

            <PasswordInputField
                password={props.oldPassword}
                setPassword={props.setOldPassword}
                placeholder={"Old Password"}
                required
            />

            <PasswordInputField
                password={props.newPassword}
                setPassword={props.setNewPassword}
                placeholder={'New Password'}
                required
            />

            <PasswordInputField
                password={props.verifyNewPassword}
                setPassword={props.setVerification}
                placeholder={"Verify New Password"}
                required
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
        padding: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
})
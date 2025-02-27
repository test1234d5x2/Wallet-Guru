import ChangePasswordInputs from "@/components/formComponents/changePasswordInputs";
import setPageTitle from "@/components/pageTitle/setPageTitle";
import clearRouterHistory from "@/utils/clearRouterHistory";
import getToken from "@/utils/tokenAccess/getToken";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import TopBar from "@/components/topBars/topBar";
import changeUserPassword from "@/utils/apiCalls/changeUserPassword";


export default function ChangePasswordPage() {
    setPageTitle("Change Password");

    const [token, setToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [verifyNewPassword, setVerification] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    getToken().then((data) => {
        if (!data) {
            Alert.alert('Error', 'You must be logged in to access this page.');
            clearRouterHistory(router);
            router.replace("/loginPage");
            return;
        }

        setToken(data.token);
        setEmail(data.email);
    });

    const validateForm = (): boolean => {
        if (!oldPassword || !newPassword || !verifyNewPassword) {
            setError("All fields are required.");
            return false;
        }
        if (newPassword !== verifyNewPassword) {
            setError("New password and confirmation do not match.");
            return false;
        }
        if (oldPassword === newPassword) {
            setError("New password must be different from the old password.");
            return false;
        }

        setError("");
        return true;
    };

    const handleChangePassword = () => {
        if (!validateForm()) {
            return;
        }
        changeUserPassword(token, email, newPassword).then((complete) => {
            if (complete) {
                Alert.alert("Success", "Password changed successfully.");
                clearRouterHistory(router);
                router.replace("/accountOverviewPage");
            }
        }).catch((err: Error) => {
            setError(err.message);
        })
    };

    return (
        <View style={styles.container}>
            <TopBar />

            <View style={styles.changePasswordForm}>
                <ChangePasswordInputs
                    oldPassword={oldPassword}
                    newPassword={newPassword}
                    verifyNewPassword={verifyNewPassword}
                    setOldPassword={setOldPassword}
                    setNewPassword={setNewPassword}
                    setVerification={setVerification}
                />
            </View>

            {error ? (
                <View style={styles.errorTextContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
                <Text style={styles.changePasswordButtonText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        minHeight: Dimensions.get("window").height,
        rowGap: 20,
    },
    changePasswordForm: {
        marginBottom: 40,
    },
    changePasswordButton: {
        backgroundColor: '#5480D4',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    changePasswordButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorTextContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});

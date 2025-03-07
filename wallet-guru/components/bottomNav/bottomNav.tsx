import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

type NavItem = {
    name: string;
    label: string;
    icon: string;
    route: string;
};

const navItems: NavItem[] = [
    {
        name: 'index',
        label: 'Dashboard',
        icon: 'home-outline',
        route: '/dashboardPage',
    },
    {
        name: 'transactions',
        label: 'Transactions',
        icon: 'list-outline',
        route: '/listTransactionsPage',
    },
    {
        name: 'analytics',
        label: 'Analytics',
        icon: 'stats-chart-outline',
        route: '/analytics/overviewPage',
    },
    {
        name: 'goals',
        label: 'Goals',
        icon: 'trophy-outline',
        route: '/allGoalsPage',
    },
];

const BottomNav: React.FC = () => {
    const router = useRouter();
    const currentPath = usePathname();

    const handleNavigation = (route: string) => {
        if (currentPath !== route) {
            router.push(`${route}`);
        }
    };

    return (
        <View style={styles.container}>
            {navItems.map((item) => {
                const isActive = currentPath === item.route;
                return (
                    <TouchableOpacity
                        key={item.name}
                        style={styles.navItem}
                        onPress={() => handleNavigation(item.route)}
                    >
                        <Ionicons
                            name={item.icon}
                            size={24}
                            color={isActive ? '#007AFF' : 'gray'}
                        />
                        <Text style={[styles.label, { color: isActive ? '#007AFF' : 'gray' }]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BottomNav;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#e2e2e2',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',

    },
    navItem: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        marginTop: 2,
    },
});

import { View, Text, StyleSheet} from "react-native";
import MenuItem from './menuItem';


const styles = StyleSheet.create({
    menuContainer: {
        display: "flex",
        flexDirection: "column",
        rowGap: 20,
    },
});


export default function MainMenu() {

    const menuItems = [
        {title: 'Add Expense'},
        {title: 'Add Income'},
        {title: 'Transaction History'},
        {title: 'Create A New Goal'},
        {title: 'View Goals'},
        {title: 'Create An Expense Category'},
        {title: 'Expense Category Overview'},
        {title: 'Spending Analytics'},
    ];

    return (
        <View>
            <View style={styles.menuContainer}>
                {menuItems.map((item) => {return <MenuItem key={item.title} title={item.title} />})}
            </View>
        </View>
    )
}
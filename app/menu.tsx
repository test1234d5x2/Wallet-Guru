import { View, Text } from "react-native";

import MainMenu from "@/components/menu";
import MenuTopBar from "@/components/menuTopBar";


export default function Menu() {
    return (
        <View>
            <View>
                <MenuTopBar />
            </View>

            <View>
                <MainMenu />
            </View>
        </View>
    )
}
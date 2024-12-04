import { View, Text } from "react-native";

import MainMenu from "@/components/menuComponents/menu";
import MenuTopBar from "@/components/topBars/menuTopBar";


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
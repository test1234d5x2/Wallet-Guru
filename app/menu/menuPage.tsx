import { View, Text } from "react-native";

import MainMenu from "@/components/menuComponents/menu";
import MenuTopBar from "@/components/topBars/menuTopBar";
import setPageTitle from "@/components/pageTitle/setPageTitle";


export default function Menu() {

    setPageTitle("Menu")

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
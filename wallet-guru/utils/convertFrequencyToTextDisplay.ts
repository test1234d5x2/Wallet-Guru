import Frequency from "@/enums/Frequency"

export default function convertFrequencyToTextDisplay(chosenFrequency: Frequency): string {
    const frequencyMapping: Record<Frequency, string> = {
        [Frequency.Daily]: "Day",
        [Frequency.Weekly]: "Week",
        [Frequency.Monthly]: "Month",
        [Frequency.Yearly]: "Year",
    }

    return frequencyMapping[chosenFrequency] || ""
}
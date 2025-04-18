import Frequency from "@/enums/Frequency"

export default function isValidFrequency(value: string): boolean {
    return Object.values(Frequency).includes(value as Frequency)
}
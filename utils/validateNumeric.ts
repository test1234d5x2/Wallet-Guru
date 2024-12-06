export default function isNumeric(number: string): boolean {
    return !/^-?\d+(\.\d+)?$/.test(number)
}
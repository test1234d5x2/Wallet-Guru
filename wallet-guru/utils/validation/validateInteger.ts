export default function isInteger(input: string): boolean {
    return /^-?\d+$/.test(input);
}
import validator from "validator"

export default function isValidEmail(email: string): boolean {
    return validator.isEmail(email)
}
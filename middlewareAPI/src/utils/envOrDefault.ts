// Date Accessed: 2/4/2025
// Website: https://github.com/hyperledger/fabric-samples/blob/main/asset-transfer-basic/application-gateway-typescript/src/app.ts

export default function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue
}
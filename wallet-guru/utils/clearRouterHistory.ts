import { Router, useRouter } from "expo-router"

export default function clearRouterHistory(router: Router) {
    while (router.canGoBack()) router.back()
    return
}
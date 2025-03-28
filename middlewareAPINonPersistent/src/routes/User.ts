import { Router } from "express"
import { create, login, remove } from "../controllers/User"
import { authenticateJWT } from "../middleware/authenticateJWT"

const router = Router()

router.post("/", create)
router.post("/login", login)
router.delete("/delete", authenticateJWT, remove)

export default router
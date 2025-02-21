import { Router } from "express";
import { create, update, remove } from "../controllers/Expense";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.post("/", authenticateJWT, create);
router.put("/:id", authenticateJWT, update);
router.delete("/:id", authenticateJWT, remove);

export default router;

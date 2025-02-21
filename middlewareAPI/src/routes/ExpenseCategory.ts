import { Router } from "express";
import { create, update, remove, listByUser, findByID } from "../controllers/ExpenseCategory";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.post("/", authenticateJWT, create);
router.put("/:id", authenticateJWT, update);
router.delete("/:id", authenticateJWT, remove);
router.get("/", authenticateJWT, listByUser);
router.get("/view/:id", authenticateJWT, findByID)

export default router;

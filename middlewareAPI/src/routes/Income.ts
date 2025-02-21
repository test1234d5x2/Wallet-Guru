import { Router } from "express";
import { create, update, remove, listByUser, findByID } from "../controllers/Income";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.post("/", authenticateJWT, create);
router.put("/:id", authenticateJWT, update);
router.delete("/:id", authenticateJWT, remove);
router.get("/", authenticateJWT, listByUser); // Get all income transactions for a user
router.get("/:id", authenticateJWT, findByID);

export default router;

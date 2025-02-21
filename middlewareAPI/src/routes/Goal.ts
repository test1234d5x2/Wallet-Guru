import { Router } from "express";
import { create, updateProgress, remove, archive } from "../controllers/Goal";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.post("/", authenticateJWT, create);
router.put("/:id/progress", authenticateJWT, updateProgress);
router.put("/:id/archive", authenticateJWT, archive);
router.delete("/:id", authenticateJWT, remove);

export default router;

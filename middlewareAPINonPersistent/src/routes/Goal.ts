import { Router } from "express";
import { create, updateProgress, remove, archive, listByUser, findByID } from "../controllers/Goal";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.post("/", authenticateJWT, create);
router.put("/:id/progress", authenticateJWT, updateProgress);
router.put("/:id/archive", authenticateJWT, archive);
router.delete("/:id", authenticateJWT, remove);
router.get("/", authenticateJWT, listByUser);
router.get("/:id", authenticateJWT, findByID);

export default router;

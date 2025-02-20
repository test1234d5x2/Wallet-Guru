import { Router } from "express";
import { create, updateProgress, remove, archive } from "../controllers/Goal";

const router = Router();

router.post("/", create);
router.put("/:id/progress", updateProgress);
router.put("/:id/archive", archive);
router.delete("/:id", remove);

export default router;

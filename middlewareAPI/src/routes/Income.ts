import { Router } from "express";
import { create, update, remove } from "../controllers/Income";

const router = Router();

router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;

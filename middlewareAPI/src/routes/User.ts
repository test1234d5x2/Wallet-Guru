import { Router } from "express";
import { create, login, update, remove } from "../controllers/User";

const router = Router();

router.post("/", create);
router.post("/login", login);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;

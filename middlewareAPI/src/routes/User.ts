import { Router } from "express";
import { create, login, remove } from "../controllers/User";

const router = Router();

router.post("/", create);
router.post("/login", login);
router.delete("/:id", remove);

export default router;

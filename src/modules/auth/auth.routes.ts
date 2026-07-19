import { Router } from "express";
import { register, login } from "./auth.controller";
import { validateRequest } from "../../middleware/validate";
import { registerSchema, loginSchema } from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;

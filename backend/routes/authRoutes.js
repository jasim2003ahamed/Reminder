import express from "express";
import { signup, signin, googleLogin, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleLogin);
router.get("/profile", authMiddleware, getProfile);

export default router;

import { Router } from "express"
import getUserStats from "../controllers/stats.controller.js"
import {authenticate , authorize ,requireToken} from "../middleware/auth.js"

const router = Router()

router.use(requireToken, authenticate , authorize(["user"]))




router.get("/stats", getUserStats);

export default router;

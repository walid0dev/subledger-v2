import { Router } from "express";
import { authenticate, authorize, requireToken } from "../middleware/auth.js"
import subscriptionsController from "../controllers/subscription.controller.js";

const router = Router()

router.use(requireToken, authenticate, authorize(["user"]))
router.get("/subscriptions" , subscriptionsController.getUserSubscriptions)


export default router


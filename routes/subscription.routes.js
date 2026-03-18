import { Router } from "express";
import { authenticate, authorize, requireToken } from "../middleware/auth.js"
import subscriptionsController from "../controllers/subscription.controller.js";
import {ownsSubscription} from "../middleware/subscription.middleware.js"
import { validate } from "../middleware/validate.js";
const router = Router()

router.use(requireToken, authenticate, authorize(["user"]))

router.get("/subscriptions" , subscriptionsController.getUserSubscriptions)
router.get("/subscriptions/:subscriptionId" , ownsSubscription , subscriptionsController.getSubscriptionById) 
router.patch("/subscriptions/:subscriptionId" , validate() , ownsSubscription , subscriptionsController.updateSubscription)



export default router


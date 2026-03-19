import { Router } from "express";
import { authenticate , requireToken , authorize } from "../middleware/auth.js"
import { catchAsync } from "../middleware/global.js"
import adminController from "../controllers/admin.controller.js"
const router = Router()

router.use(requireToken , authenticate , authorize(["admin"]))
router.get("/users", catchAsync(adminController.GetUsers)) 
router.get("/me" , catchAsync(adminController.getProfile))
router.get("/users/:id", catchAsync(adminController.GetUserDetails))
router.get("/users/:id/transactions", catchAsync(adminController.GetUserTransactions))
router.get("/users/:userId/subscriptions/:subscriptionId/transactions", catchAsync(adminController.GetSubscriptionTransactions))

export default router

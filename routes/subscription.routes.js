import { Router } from "express";
import z from "zod";
import { authenticate, authorize, requireToken } from "../middleware/auth.js";
import subscriptionsController from "../controllers/subscription.controller.js";
import { ownsSubscription } from "../middleware/subscription.middleware.js";
import { validate } from "../middleware/validate.js";
import {
	PatchSubscriptionsSchema,
	PostSubscriptionsSchema,
	SubscriptionIdParamsSchema,
} from "../schemas/index.js";

const router = Router();

const PostSubscriptionTransactionSchema = z.object({
	body: z
		.object({
			amount: z.number().min(0),
			paymentDate: z.coerce.date(),
			status: z.enum(["paid", "failed"]),
		})
		.strict(),
});

router.use(requireToken, authenticate, authorize(["user"]));

router.get("/subscriptions", subscriptionsController.getUserSubscriptions);
router.post(
	"/subscriptions",
	validate(PostSubscriptionsSchema),
	subscriptionsController.createSubscription,
);

router.get(
	"/subscriptions/:subscriptionId",
	validate(SubscriptionIdParamsSchema),
	ownsSubscription,
	subscriptionsController.getSubscriptionById,
);

router.patch(
	"/subscriptions/:subscriptionId",
	validate(SubscriptionIdParamsSchema),
	validate(PatchSubscriptionsSchema),
	ownsSubscription,
	subscriptionsController.updateSubscription,
);

router.delete(
	"/subscriptions/:subscriptionId",
	validate(SubscriptionIdParamsSchema),
	ownsSubscription,
	subscriptionsController.deleteSubscription,
);

router.patch(
	"/subscriptions/:subscriptionId/cancel",
	validate(SubscriptionIdParamsSchema),
	ownsSubscription,
	subscriptionsController.cancelSubscription,
);

router.get(
	"/subscriptions/:subscriptionId/transactions",
	validate(SubscriptionIdParamsSchema),
	ownsSubscription,
	subscriptionsController.getSubscriptionTransactions,
);

router.post(
	"/subscriptions/:subscriptionId/transactions",
	validate(SubscriptionIdParamsSchema),
	validate(PostSubscriptionTransactionSchema),
	ownsSubscription,
	subscriptionsController.createTransaction,
);

router.get("/transactions", subscriptionsController.getUserTransactions);

export default router


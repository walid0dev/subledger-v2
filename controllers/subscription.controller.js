import { sendResponse } from "../utils/response.js";
import { catchAsync } from "../middleware/global.js";
import subscriptionService from "../services/subscription.service.js";
import transactionService from "../services/transaction.service.js";

const getUserSubscriptions = catchAsync(async (req, res) => {
    const { page, limit, status } = req.query;
    const data = await subscriptionService.getUserSubs(req.user.id, {
        page,
        limit,
        status,
    });

    sendResponse(res, 200, data, "Subscriptions retrieved successfully");
});

const createSubscription = catchAsync(async (req, res) => {
    const created = await subscriptionService.createSub(req.user.id, req.body);
    sendResponse(res, 201, { subscription: created }, "Subscription created successfully");
});

const cancelSubscription = catchAsync(async (req, res) => {
    const updated = await subscriptionService.cancelSub(req.subscription);
    sendResponse(
        res,
        200,
        { subscription: updated },
        "Subscription cancelled successfully",
    );
});

const getSubscriptionById = catchAsync(async (req, res) => {
    const { page, limit, status, fromDate, toDate } = req.query;
    const details = await subscriptionService.getSubWithTransactions(req.subscription.id, {
        page,
        limit,
        status,
        fromDate,
        toDate,
    });

    sendResponse(res, 200, details, "Subscription retrieved successfully");
});

const updateSubscription = catchAsync(async (req, res) => {
    const updated = await subscriptionService.updateSub(req.subscription, req.body);
    sendResponse(res, 200, { subscription: updated }, "Subscription updated successfully");
});

const deleteSubscription = catchAsync(async (req, res) => {
    const deleted = await subscriptionService.deleteSub(req.subscription);
    sendResponse(
        res,
        200,
        { subscription: deleted },
        "Subscription deleted successfully",
    );
});

const createTransaction = catchAsync(async (req, res) => {
    const transaction = await transactionService.createTransactionForSubscription(
        req.subscription,
        req.body,
    );
    sendResponse(res, 201, { transaction }, "Transaction created successfully");
});

const getSubscriptionTransactions = catchAsync(async (req, res) => {
    const { page, limit, status, fromDate, toDate } = req.query;
    const data = await transactionService.getSubscriptionTransactions(req.subscription._id, {
        page,
        limit,
        status,
        fromDate,
        toDate,
    });

    sendResponse(res, 200, data, "Transactions retrieved successfully");
});

const getUserTransactions = catchAsync(async (req, res) => {
    const { page, limit, status, subscriptionId, fromDate, toDate } = req.query;
    const data = await transactionService.getUserTransactions(req.user.id, {
        page,
        limit,
        status,
        subscriptionId,
        fromDate,
        toDate,
    });

    sendResponse(res, 200, data, "User transactions retrieved successfully");
});

export default {
    getUserSubscriptions,
    createSubscription,
    cancelSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    createTransaction,
    getSubscriptionTransactions,
    getUserTransactions,
};

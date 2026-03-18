import subscription from "../models/Subscription.model.js";
import transaction from "../models/Transaction.model.js";

const calculateUserStats = async (userId) => {
    const subscrptions = await subscription.find({ userId }); // Query subscriptions by userId/req.user.id from JWT (authMiddleware).

    // Handle empty results
    if (!subscrptions.length) {
        return {
            totalSubscriptions: 0,
            totalTransactions: 0,
            cancelledSubscriptions: 0,
            totalSpent: 0,
        };
    }

    const subscriptionIds = subscrptions.map((sub) => sub.id);
    // Query transactions linked to these subscriptions

    const transactions = await transaction.find({
        subscrptionId: { $in: subscriptionIds },
    });

    const totalSubscriptions = subscrptions.length;
    const activeSubscriptions = subscrptions.filter(
        (sub) => sub.status === "active",
    ).length;
    const cancelledSubscriptions = subscrptions.filter(
        (sub) => sub.status === "cancelled",
    ).length;
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
        totalSubscriptions,
        activeSubscriptions,
        cancelledSubscriptions,
        totalSpent,
    };
};

export default { calculateUserStats };

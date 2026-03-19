import Subscription from "../models/Subscription.model.js";
import Transaction from "../models/Transaction.model.js";
import { ConflictError, NotFoundError, InternalError } from "../utils/errors.js";
import { getUser } from "./user.service.js";

const normalizePagination = (page, limit) => {
  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) > 0 && Number(limit) <= 100
      ? Number(limit)
      : 10;

  return { page: safePage, limit: safeLimit };
};

export const getUserSubs = async (userId, options = {}) => {
  const { page, limit } = normalizePagination(options.page, options.limit);
  const filter = { user: userId };

  if (options.status) {
    filter.status = options.status;
  }

  const [subscriptions, total] = await Promise.all([
    Subscription.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Subscription.countDocuments(filter),
  ]);

  return {
    subscriptions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const createSub = async (userId, subscription) => {
  const user = await getUser({ id: userId }, { _id: 1 });
  const created = await Subscription.create({ ...subscription, user: user._id });
  return created;
};

export const getSub = async (id) => {
  const sub = await Subscription.findById(id);
  if (!sub) throw new NotFoundError("Subscription not found");
  return sub;
};

export const getSubWithTransactions = async (subscriptionId, options = {}) => {
  const sub = await getSub(subscriptionId);
  const { page, limit } = normalizePagination(options.page, options.limit);
  const transactionFilter = { subscription: sub._id };

  if (options.status) {
    transactionFilter.status = options.status;
  }

  if (options.fromDate || options.toDate) {
    transactionFilter.paymentDate = {};
    if (options.fromDate) {
      transactionFilter.paymentDate.$gte = new Date(options.fromDate);
    }
    if (options.toDate) {
      transactionFilter.paymentDate.$lte = new Date(options.toDate);
    }
  }

  const [transactions, totalTransactions, totals] = await Promise.all([
    Transaction.find(transactionFilter)
      .sort({ paymentDate: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(transactionFilter),
    Transaction.aggregate([
      { $match: { subscription: sub._id } },
      {
        $group: {
          _id: "$subscription",
          totalSpent: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  return {
    subscription: sub,
    transactions,
    totalSpent: totals[0]?.totalSpent || 0,
    pagination: {
      page,
      limit,
      total: totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit) || 1,
    },
  };
};

// we get the subscription from the ownership middleware so we can just call delete on it
export const deleteSub = async (subscription) => {
  const deleteResult = await subscription.deleteOne();
  if (deleteResult.deletedCount === 0) {
    throw new InternalError("Failed to delete subscription");
  }
  return subscription;
};

export const updateSub = async (subscription, updated) => {
  subscription.set(updated);
  await subscription.save();
  return subscription;
};

const cancelSub = async (subscription) => {
  if (subscription.status === "cancelled") {
    throw new ConflictError("Subscription already canceled");
  }

  subscription.status = "cancelled";
  await subscription.save();
  return subscription;
};

export default {
  getUserSubs,
  createSub,
  deleteSub,
  updateSub,
  getSub,
  cancelSub
}




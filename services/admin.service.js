import User from "../models/User.model.js"
import Subscription from "../models/Subscription.model.js"
import Transaction from "../models/Transaction.model.js"
import { NotFoundError } from "../utils/errors.js"
import mongoose from "mongoose"

export async function getUsers(){
    const users = await User.find({}, { password_hash: 0 })
    return users
}

export async function getAdminProfile(id){
    const admin = await User.findById(id, { password_hash: 0 })
    if(!admin) throw new NotFoundError("admin not found")
    return admin
}

export async function getUserProfile(userId) {
    const user = await User.findById(userId, { password_hash: 0 })
    if (!user) throw new NotFoundError("User not found")

    const subscriptions = await Subscription.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "transactions",
                localField: "_id",
                foreignField: "subscription",
                as: "transactions"
            }
        },
        {
            $project: {
                name: 1,
                price: 1,
                billing_cycle: 1,
                status: 1,
                totalSpent: { $sum: "$transactions.amount" }
            }
        }
    ])

    const globalTotalSpent = subscriptions.reduce((acc, sub) => acc + (sub.totalSpent || 0), 0)

    return {
        user,
        subscriptions,
        globalTotalSpent
    }
}

export async function getUserTransactions(userId) {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError("User not found")
    
    const transactions = await Transaction.find({ user: userId })
        .populate("subscription", "name")
        .sort({ paymentDate: -1 })
    return transactions
}

export async function getSubscriptionTransactions(userId, subscriptionId) {
    const subscription = await Subscription.findOne({ _id: subscriptionId, user: userId })
    if (!subscription) throw new NotFoundError("Subscription not found for this user")

    const transactions = await Transaction.find({ subscription: subscriptionId })
        .sort({ paymentDate: -1 })
    return transactions
}


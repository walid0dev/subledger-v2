import Subscription from "../models/Subscription.model.js";
import Transaction from "../models/Transaction.model.js"
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { catchAsync } from "./global.js"


export const ownsSubscription = catchAsync(async (req, res, next) => {
    const subscriptionId = req.params.subscriptionId
    const subscription = await Subscription.findById(subscriptionId)
    if (!subscription) throw new NotFoundError("Subscription not found")
    if (req.user.id !== subscription.user.toString()) throw new UnauthorizedError("Unauthorized operation")
    req.subscription = subscription
    next()
})

export const ownsTransaction = catchAsync(async (req, res, next) => {
    const transactionId = req.params.transactionId
    const transaction = await Transaction.findById(transactionId)
    if (!transaction) throw new NotFoundError("Transaction not found")

    if (transaction.subscription.user !== req.user.id) {
        throw new UnauthorizedError("Unauthorized operation")
    }

    req.transaction = transaction
    next()
    return

})

export default {ownsSubscription , ownsTransaction}
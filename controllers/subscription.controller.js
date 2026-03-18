import { sendResponse } from "../utils/response.js"
import { catchAsync } from "../middleware/global.js"
import { getUserSubs } from "../services/subscription.service.js"
import subscriptionService from "../services/subscription.service.js"
import {InternalError} from "../utils/errors.js"

const getUserSubscriptions = catchAsync(async (req, res) => {
    const subscriptions = await getUserSubs(req.user.id)
    sendResponse(res, 200, { subscriptions })
})

const cancelSubscription = catchAsync(async (req, res) => {
    const updated = await subscriptionService.cancelSub(req.subscription)
    sendResponse(res, 200, updated, "Subscription cancelled successfully")
})

const getSubscriptionById = catchAsync(async (req, res) => {
    sendResponse(res, 200, { subscription: req.subscription }, "Subscription retrieved successfully")
})

const updateSubscription = catchAsync(async (req, res, next) => {
    const subscription = req.subscription
    const updatedData = req.body
    const updated = subscriptionService.updateSub(subscription, updatedData)
    sendResponse(res, 200, { subscription: updated }, "Subscription retrieved successfully")

})

const deleteSubscription = catchAsync(async (req,res)=>{
  const subscription = req.subscription 
  const deleted  = await subscriptionService.deleteSub(subscription)
  sendResponse(res , 200 , {subscription:deleted} , "Subscription deleted successfully")
})






export default { getUserSubscriptions, cancelSubscription, getSubscriptionById  , updateSubscription}

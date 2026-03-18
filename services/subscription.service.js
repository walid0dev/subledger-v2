import Subscription from "../models/Subscription.model.js";
import { ConflictError, NotFoundError, AppError, InternalError } from "../utils/errors.js";
import { getUser } from "./user.service.js";

export const getUserSubs = async (id) => {
  return await Subscription.find({ user:id })
}

export const createSub = async (userId, subscription) => {
  const user = await getUser(userId)
  return await Subscription.create({ ...subscription, user: user._id }).save()
}

export const getSub = async (id) => {
  const sub = await Subscription.findById(id)
  if (!sub) throw new NotFoundError("Subscription not found")
  return sub
}

// we get the subscription from the ownership middleware so we can just call delete on it
export const deleteSub = async (subscription) => {
  const deleteCount = await subscription.deleteOne()
  if (deleteCount === 0) throw new InternalError("Failed to delete subscription")
  return deleted
}

export const updateSub = async (subscription , updated) => {
  subscription.set({ ...subscription , ...updated }) 
  await subscription.save()
  return subscription
}



const cancelSub = async (subscription /* typescript looking really good right now 🤞 */) => {
  if (subscription.status === "cancelled") throw new ConflictError("Subscription already canceled")
  subscription.status === "cancelled"
  await subscription.save()
  return subscription
}

export default {
  getUserSubs,
  createSub,
  deleteSub,
  updateSub,
  getSub,
  cancelSub
}




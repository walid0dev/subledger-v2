import Subscription from "../models/Subscription.model.js";
import { NotFoundError } from "../utils/errors.js";
import { getUser } from "./user.service.js";

export const getUserSubs =  async (id) => {
  return await Subscription.find({_id:id})
}


export const createSub = async (userId , subscription) => {
  const user  = await getUser(userId)
  return await Subscription.create({...subscription, user: user._id}).save()
}


export const deleteSub = async (id) => {
  const deleted = await Subscription.findByIdAndDelete(id)
  if(!deleted) throw new NotFoundError("Subscription not found")
  return deleted
}

export const updateSub = async (id, subscription) => {
  const updated = await Subscription.findByIdAndUpdate(id, subscription, {new: true})
  if(!updated) throw new NotFoundError("Subscription not found")
  return updated
}

export const getSub = async (id) => {
  const sub = await Subscription.findById(id)
  if(!sub) throw new NotFoundError("Subscription not found")
  return sub
}


export default {
  getUserSubs,
  createSub,
  deleteSub,
  updateSub,
  getSub
}




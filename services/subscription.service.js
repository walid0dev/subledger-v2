import Subscription from "../models/Subscription.model.js";
import User from "../models/User.model.js"
import {NotFoundError} from "../utils/errors.js"


export const getUserSubs =  async (id) => {
  return await Subscription.find({_id:id})
}


export const createSub = async (userId , subscription) => {
  const user  = await getUser(userId)
  return await Subscription.create({...subscription, userId: user._id}).save()
}




export const getUser = async (id) =>{
  const user = await User.findById(id)
  if(!user) throw new NotFoundError("user not found")
  return user
}


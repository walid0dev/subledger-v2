import User from "../models/User.model.js"
import { NotFoundError } from "../utils/errors.js"



export async function getUsers(){
    const users = await User.find()
    return users
}

export async function getAdminProfile(id){
    const admin = await User.findById(id)
    if(!admin) throw new NotFoundError("admin not found")
    return admin
}
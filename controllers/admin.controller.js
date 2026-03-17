import { getUsers, getAdminProfile } from "../services/admin.service.js"
import { sendResponse } from "../utils/response.js"


async function GetUsers(req,res){
    const users  = await getUsers()
    sendResponse(res , 200 , users ) 

}

async function getProfile(req,res) {
    const {id} = req.user
    const admin = await getAdminProfile(id)
    sendResponse(res, 200 , admin)
    return
}


export default {GetUsers  , getProfile}
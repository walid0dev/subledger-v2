import { getUsers, getAdminProfile, getUserProfile, getUserTransactions, getSubscriptionTransactions } from "../services/admin.service.js"
import { sendResponse } from "../utils/response.js"


async function GetUsers(req,res){
    const users  = await getUsers()
    sendResponse(res , 200 , users ) 
}

async function getProfile(req,res) {
    const {id} = req.user
    const admin = await getAdminProfile(id)
    sendResponse(res, 200 , admin)
}

async function GetUserDetails(req, res) {
    const { id } = req.params
    const profile = await getUserProfile(id)
    sendResponse(res, 200, profile)
}

async function GetUserTransactions(req, res) {
    const { id } = req.params
    const transactions = await getUserTransactions(id)
    sendResponse(res, 200, transactions)
}

async function GetSubscriptionTransactions(req, res) {
    const { userId, subscriptionId } = req.params
    const transactions = await getSubscriptionTransactions(userId, subscriptionId)
    sendResponse(res, 200, transactions)
}

export default { GetUsers, getProfile, GetUserDetails, GetUserTransactions, GetSubscriptionTransactions }
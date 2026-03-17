import {sendResponse} from "../utils/response.js"
import {catchAsync} from "../middleware/global.js"
import {getUserSubs} from "../services/subscription.service.js"

const getUserSubscriptions = catchAsync(async (req,res)=>{
    const subscriptions = await getUserSubs(req.user.id)
    sendResponse(res, 200, { subscriptions })
})


export default {getUserSubscriptions}
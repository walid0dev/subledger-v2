import subscription from "../models/Subscription.model.js";
import statsService from "../services/stats.service.js";

const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await statsService.calculateUserStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default getUserStats;

import mongoose from "mongoose";
import User from "../models/User.model.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";

export const createUser = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) {
    throw new ConflictError("A user with this email already exists");
  }
  const user = await User.create(userData);
  return await user.save();
};

export const getUser = async (query, project) => {
  const filter = query.id ? { _id: query.id } : { email: query.email };
  const user = await User.findOne(filter, project || undefined);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const getAllUsers = async () => {
  return await User.find(
    {},
    {
      password_hash: 0,
      __v: 0,
    },
  );
};

export const getUserDetails = async (userId) => {
  const [userDetails] = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "user",
        as: "subscriptions",
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "subscriptions._id",
        as: "transactions",
      },
    },
    {
      $project: {
        password_hash: 0,
        __v: 0,
        subscriptions: {
          __v: 0,
          user: 0,
          _id: 0,
        },
        transactions: {
          __v: 0,
          user: 0,
          _id: 0,
        },
        totalSpent: { $sum: "$transactions.amount" },
        totalSpentBySubscription: {
          $map: {
            input: "$subscriptions",
            as: "sub",
            in: {
              name: "$$sub.name",
              totalSpent: {
                $sum: {
                  $map: {
                    input: "$transactions",
                    as: "txn",
                    in: {
                      $cond: [
                        { $eq: ["$$txn.subscription", "$$sub._id"] },
                        "$$txn.amount",
                        0,
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);
  return userDetails;
};

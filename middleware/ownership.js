import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { catchAsync } from "./global.js";
import express from "express";
/**
 * @param {model} Model - The Mongoose Model (e.g., Subscription)
 * @param {string} paramName - The key in req.params (e.g., 'subscriptionId')
 * @param {string} userPath - The path to the user ID field on the doc
 * @returns {express.Handler}
 */
export const authorizeOwnership = (Model, paramName, userPath = "user") => 
    catchAsync(async (req, res, next) => {
        const id = req.params[paramName];
        
        // Use populate if the user ID is nested (e.g., 'subscription.user')
        const query = Model.findById(id);
        if (userPath.includes(".")) {
            query.populate(userPath.split(".")[0]);
        }

        const doc = await query.exec();

        if (!doc) {
            throw new NotFoundError(`${Model.modelName} not found`);
        }

        // Get the actual user ID value from the document
        // This handles nested paths like doc.subscription.user
        const ownerId = userPath.split(".").reduce((obj, key) => obj?.[key], doc);

        if (!ownerId || !ownerId.equals(req.user.id)) {
            throw new UnauthorizedError("You do not own this resource");
        }

        // Attach to req using the model name (e.g., req.subscription)
        req[Model.modelName.toLowerCase()] = doc;
        next();
    });
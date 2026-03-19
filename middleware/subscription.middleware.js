import Subscription from "../models/Subscription.model.js";
import { authorizeOwnership } from "./ownership.js";

export const ownsSubscription = authorizeOwnership(
  Subscription,
  "subscriptionId",
  "user",
);

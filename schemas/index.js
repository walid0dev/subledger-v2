import z from "zod";

// reusable schema components
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const RoleSchema = z.enum(["user", "admin"]);
const BillingCycleSchema = z.enum(["monthly", "yearly"]);
const SubscriptionStatusSchema = z.enum(["active", "cancelled"]);
const TransactionStatusSchema = z.enum(["paid", "failed"]);

export const UserLoginSchema = z.object({
  body: z
    .object({
      email: z.email(),
      password: z.string().min(6),
    })
    .strict(),
});

export const UserSignUpSchema = z.object({
  body: z
    .object({
      email: z.email(),
      password: z.string().min(6),
      role: RoleSchema,
      username: z.string().min(6).max(50),
    })
    .strict(),
});

export const JwtUserSchema = z
  .object({
    id: ObjectIdSchema,
    email: z.string(),
    role: RoleSchema,
  })
  .strict();

export const PostSubscriptionsSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1),
      price: z.number().min(0),
      billing_cycle: BillingCycleSchema,
    })
    .strict(),
});

export const PatchSubscriptionsSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      price: z.number().min(0).optional(),
      billing_cycle: BillingCycleSchema.optional(),
      status: SubscriptionStatusSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

export const SubscriptionIdParamsSchema = z.object({
  params: z.object({
    subscriptionId: ObjectIdSchema,
  }),
});

export const PostTransactionsSchema = z.object({
  body: z
    .object({
      subscription: ObjectIdSchema,
      amount: z.number().min(0),
      paymentDate: z.coerce.date(),
      status: TransactionStatusSchema,
    })
    .strict(),
});

export const PatchTransactionsSchema = z.object({
  body: z
    .object({
      subscription: ObjectIdSchema.optional(),
      amount: z.number().min(0).optional(),
      paymentDate: z.coerce.date().optional(),
      status: TransactionStatusSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

export const TransactionIdParamsSchema = z.object({
  params: z.object({
    transactionId: ObjectIdSchema,
  }),
});

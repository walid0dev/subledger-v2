import z from "zod"
export const SubscriptionUpdateSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        price: z.number().min(0).optional(),
        billing_cycle: z.enum(["monthly", "yearly"]).optional(),
        status: z.enum(["active", "cancelled"]).optional()
    }).refine((data) => {
        if (Object.keys(data).length === 0) {
            return false;
        }
    }, { message: "At least one field must be provided for update" })
})

export const SubscriptionCreateSchema = z.object({
    body: z.object({
        name: z.string().min(4).max(50),
        price: z.number().min(0),
        billing_cycle: z.enum(["monthly", "yearly"]),
        status: z.enum(["active", "cancelled"]).default("active")
    }),
})



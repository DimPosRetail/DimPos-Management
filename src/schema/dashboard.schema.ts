import { z } from "zod";

export const DashboardSchema = z.object({
    totalDineInRevenue: z.number(),
    totalTakeAwayRevenue: z.number(),
    totalSubTotalRevenue: z.number(),
    totalRevenue: z.number(),
    totalDiscountRevenue: z.number(),
    totalDineInOrders: z.number(),
    totalTakeAwayOrders: z.number(),
    totalOrders: z.number(),
    averageOrderValue: z.number(),
    averageDineInOrderValue: z.number(),
    averageTakeAwayOrderValue: z.number(),
    averageItemsPerOrder: z.number(),
    averageDineInItemsPerOrder: z.number(),
    averageTakeAwayItemsPerOrder: z.number(),
})

export type TDashboardResponse = z.infer<typeof DashboardSchema>;
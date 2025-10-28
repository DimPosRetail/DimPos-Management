import { z } from "zod";

export const StorePurchaseOrderItem = z.object({
  id: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  productVariantIdSnapshot: z.string().nullable(),
  productVariantNameSnapshot: z.string().nullable(),
  productVariantPriceSnapshot: z.number(),
  totalPriceOfOrderItems: z.number(),
  requestedQuantity: z.number(),
  approvedQuantityByBrand: z.number().nullable().optional(),
});
export const UpdateStorePurchaseOrderItem = z.object({
  id: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  approvedQuantityByBrand: z.number().nullable().optional(),
});

export type TStorePurchaseOrderItem = z.infer<typeof StorePurchaseOrderItem>;
export type TUpdateStorePurchaseOrderItem = z.infer<typeof UpdateStorePurchaseOrderItem>;
import { z } from "zod";
import { IngredientSchema } from "./ingredients.schema";

export const InventoryStockSchema = z.object({
    id: z.string().uuid(),
    quantity: z.number({message: "Giá trị phải là số"}).nonnegative("Số lượng không được âm"),
    reOrderLevel:z.number({message: "Giá trị phải là số"}).nonnegative("Số lượng không được âm"),
    createdDate: z.date(),
    lastModifiedDate: z.date().optional(),
    ingredient: IngredientSchema.omit({ isActive : true})
})

export const UpdateInventoryStockRequestSchema = z.object({
    quantity: z.number({message: "Giá trị phải là số"}).nonnegative("Số lượng không được âm"),
    reasonManualAdjustment: z.string({message: "Lý do điều chỉnh không được để trống"}).trim().min(1, "Lý do điều chỉnh không được để trống"),
    note: z.string().trim().optional(),
})

export const InventoryTransactionTypeEnum = z.union([
  z.literal(0, { message: "Loại giao dịch tồn kho không hợp lệ" }),
  z.literal(1, { message: "Loại giao dịch tồn kho không hợp lệ" }),
  z.literal(2, { message: "Loại giao dịch tồn kho không hợp lệ" }),
]);

export const InventoryTransactionSchema = z.object({
    id: z.string().uuid(),
    type: InventoryTransactionTypeEnum,
    quantityChange:z.number({message: "Giá trị phải là số"}),
    reasonManualAdjustment: z.string().optional(),
    note: z.string().optional(),
    createdDate: z.date(),
    lastModifiedDate: z.date(),
    relatedOrderId: z.string().uuid().optional(),
    relatedStorePurchaseOrderItemId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
})

export type TInventoryStock = z.infer<typeof InventoryStockSchema>;
export type TUpdateInventoryStockRequest = z.infer<typeof UpdateInventoryStockRequestSchema>;
export type TInventoryTransaction = z.infer<typeof InventoryTransactionSchema>;
import { z } from "zod";

export const OrderItemSchema = z.object({
    id: z.string().uuid(),
    productVariantNameSnapshot: z.string().min(1, { message: "Không được bỏ trống" }).max(50, { message: "Không được quá 50 ký tự" }),
    quantity: z.number().int().min(1, { message: "Số lượng không dưới 1" }),
    unitPriceSnapshot: z.number().min(0,{message: "Giá không dưới 0" }),
    totalPriceBeforeItemDiscount: z.number().min(0,{message: "Giá không dưới 0" }),
    note: z.string().nullable(),
    orderItemSelectedOptions: z.array(z.object({
      id: z.string().uuid(),
      modifierGroupId: z.string().uuid(),
      modifierGroupSnapshot: z.string().min(1, { message: "Không được bỏ trống" }).max(50, { message: "Không được quá 50 ký tự" }).optional(),
      modifierOptionId: z.string().uuid(),
      modifierOptionSnapshot: z.string().min(1, { message: "Không được bỏ trống" }).max(50, { message: "Không được quá 50 ký tự" }).optional(),
      priceDeltaOptionSnapshot: z.number().min(0, { message: "Giá không dưới 0" }).optional(),
    })).optional(),
    orderItemExtras: z.array(z.object({
      productVariantId: z.string().uuid({ message: "ID biến thể không hợp lệ" }),
      productNameSnapshot: z.string({ message: "Tên sản phẩm không hợp lệ" }),
      productVariantNameSnapshot: z.string({ message: "Tên biến thể không hợp lệ" }),
      quantity: z.number({ message: "Số lượng không hợp lệ" }).int(),
      unitPriceSnapshot: z.number({ message: "Đơn giá không hợp lệ" }),
    })).optional(),
});
export type TOrderItem = z.infer<typeof OrderItemSchema>;
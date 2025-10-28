import { z } from "zod";

export const IngredientSchema = z.object({
    id: z.string().uuid(),
    code: z.string({message: "Mã thành phần không được để trống."}).trim().min(1, {message: "Mã thành phần không được để trống."}).max(50, { message: "Mã thành phần không được vượt quá 50 ký tự" }),
    name: z.string({message: "Tên thành phần không được để trống."}).trim().min(1, {message: "Tên thành phần không được để trống."}).max(200, { message: "Tên thành phần không được vượt quá 200 ký tự" }),
    sku: z.string({message: "Mã SKU không được để trống."}).trim().min(1, {message: "Mã SKU không được để trống."}).max(50, { message: "Mã SKU không được vượt quá 50 ký tự" }),
    measureUnit: z.string({message: "Đơn vị tính không được để trống."}).trim().min(1, {message: "Đơn vị tính không được để trống."}).max(50, { message: "Đơn vị tính không được vượt quá 50 ký tự" }),
    description: z.string().trim().optional(),
    isActive: z.boolean({message: "Trạng thái hoạt động là bắt buộc"}),
})

export const CreateIngredientSchema = IngredientSchema.omit({
    id:true,
    isActive: true,
})
export const UpdateIngredientSchema = IngredientSchema.omit({
    id: true,
})

export type TIngredientResponse = z.infer<typeof IngredientSchema>;
export type TCreateIngredientRequest = z.infer<typeof CreateIngredientSchema>;
export type TUpdateIngredientRequest = z.infer<typeof UpdateIngredientSchema>;
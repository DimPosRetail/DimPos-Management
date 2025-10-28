import { z } from "zod";

export const ProductExtraSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Tên sản phẩm thêm không được để trống").max(100, "Tên sản phẩm thêm không được vượt quá 100 ký tự"),
    code: z.string().min(1, "Mã sản phẩm thêm không được để trống").max(50, "Mã sản phẩm thêm không được vượt quá 50 ký tự"),
    sku: z.string().min(1, "SKU sản phẩm thêm không được để trống").max(50, "SKU sản phẩm thêm không được vượt quá 50 ký tự"),
    price: z.number({message: "Giá sản phẩm phải là số"}).min(0, "Giá sản phẩm thêm phải lớn hơn hoặc bằng 0"),
    description: z.string().optional(),
    displayOrder: z.number({message:"Thứ tự hiển thị phải là số"}).int({message: "Thứ tự hiển thị phải là số nguyên"}).min(0, "Thứ tự hiển thị phải là số nguyên không âm"),
    isActive: z.boolean(),
});

export const CreateProductExtraSchema = ProductExtraSchema.omit({ id: true, isActive: true });
export const UpdateProductExtraSchema = ProductExtraSchema.omit({ id: true, code: true, sku: true });

export type TProductExtra = z.infer<typeof ProductExtraSchema>;
export type TCreateProductExtra = z.infer<typeof CreateProductExtraSchema>;
export type TUpdateProductExtra = z.infer<typeof UpdateProductExtraSchema>;
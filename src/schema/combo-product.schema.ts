import { z } from "zod";
import { CreateProductImageSchema, ProductImageSchema } from "./product.schema";
import { ProductVariantSchema } from "./product-variant.schema";

export const ComboProductSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    displayOrder: z.number().int().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }).optional(),
    note: z.string().nullable().optional(),
    price: z.number( {message: "Giá phải là số"} ).min(0, {message: "Giá không được nhỏ hơn 0"}),    
    isActive: z.boolean(),
    sku: z.string().nullable(),
    productImages: z.array(ProductImageSchema).optional(),
    comboProductItems: z.array(z.object({
        id: z.string().uuid(),
        quantity: z.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
        displayOrder: z.number().int().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }).optional(),
        productVariant: ProductVariantSchema.omit({
            productId: true,
            categoryId: true,
        })
    })).optional(),
});

export const CreateItemProductVariantSchema = z.object({
    productVariantId: z.string().uuid({ message: "ID sản phẩm không hợp lệ" }),
    productVariantName: z.string({ message: "Tên sản phẩm không được bỏ trống" }).trim().min(1, { message: "Tên sản phẩm phải có ít nhất 1 ký tự" }).max(200, { message: "Tên sản phẩm không được vượt quá 200 ký tự" }),
    quantity: z.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
    displayOrder: z.number().int().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }).optional(),
    unitPrice: z.number().optional(),
})

export const CreateItemProductVariantsSchema = z.object({
    itemProductVariants: z.array(CreateItemProductVariantSchema).min(2, { message: "Phải có ít nhất 2 sản phẩm trong combo" }),
})

export const CreateComboProductSchema = ComboProductSchema.omit({ id: true, isActive: true, comboProductItems: true }).extend({
    code: z.string({ message: "Mã của combo không được bỏ trống" }).trim().min(1, { message: "Mã của combo phải có ít nhất 1 ký tự" }).max(50, { message: "Mã của combo không được vượt quá 50 ký tự  " }),
    sku: z.string({message: "Mã SKU của combo không được bỏ trống"}).trim().min(1, { message: "Mã SKU của combo phải có ít nhất 1 ký tự" }).max(100, { message: "SKU của combo không được vượt quá 100 ký tự" }),
    name: z.string({ message: "Tên của combo không được bỏ trống" }).trim().min(1, { message: "Tên của combo phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của combo không được vượt quá 200 ký tự" }),
    description: z.string({ message: "Mô tả của combo không được bỏ trống" }).trim().max(1000, { message: "Mô tả của combo không được vượt quá 1000 ký tự" }).optional(),
    displayOrder: z.number({message: "Thứ tự hiển thị không được bỏ trống"}).int({message: "Thứ tự hiển thị phải là số nguyên"}).min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }),
    note: z.string().nullable().optional(),
    itemProductVariants: z.array(CreateItemProductVariantSchema),
    productImages: z.array(CreateProductImageSchema).optional(),
})

export const UpdateComboProductSchema = ComboProductSchema.omit({ id: true, comboProductItems: true }).extend({
    code: z.string({ message: "Mã của combo không được bỏ trống" }).trim().min(1, { message: "Mã của combo phải có ít nhất 1 ký tự" }).max(50, { message: "Mã của combo không được vượt quá 50 ký tự  " }),
    sku: z.string({message: "Mã SKU của combo không được bỏ trống"}).trim().min(1, { message: "Mã SKU của combo phải có ít nhất 1 ký tự" }).max(100, { message: "SKU của combo không được vượt quá 100 ký tự" }),
    name: z.string({ message: "Tên của combo không được bỏ trống" }).trim().min(1, { message: "Tên của combo phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của combo không được vượt quá 200 ký tự" }),
    description: z.string({ message: "Mô tả của combo không được bỏ trống" }).trim().max(1000, { message: "Mô tả của combo không được vượt quá 1000 ký tự" }).optional(),
    displayOrder: z.number().int().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }).optional(),
    note: z.string().nullable().optional(),
    newProductImages: z.array(CreateProductImageSchema).nullable(),
})

export const ComboProductItemSchema = z.object({
    id: z.string().uuid(),
    quantity: z.number({ message: "Số lượng không được bỏ trống"}).int("Số lượng phải là số nguyên").min(1, { message: "Số lượng phải lớn hơn 0" }),
    displayOrder: z.number({ message: "Thứ tự hiển thị không được bỏ trống"}).int("Thứ tự hiển thị phải là số nguyên").min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }).optional(),
    productVariant: ProductVariantSchema.omit({
        productId: true,
        categoryId: true,
    })
});

export const UpdateComboProductItemSchema = z.object({
    quantity: z.number({ message: "Số lượng không được bỏ trống"}).int("Số lượng phải là số nguyên").min(1, { message: "Số lượng phải lớn hơn 0" }),
    displayOrder: z.number({ message: "Thứ tự hiển thị không được bỏ trống"}).int("Thứ tự hiển thị phải là số nguyên").min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }),
})

export const AddItemToComboProductSchema = z.object({
    productVariantItemId: z.string().uuid({ message: "ID sản phẩm không hợp lệ" }),
    quantity: z.number({ message: "Số lượng không được bỏ trống"}).int("Số lượng phải là số nguyên").min(1, { message: "Số lượng phải lớn hơn 0" }),
    displayOrder: z.number({ message: "Thứ tự hiển thị không được bỏ trống"}).int("Thứ tự hiển thị phải là số nguyên").min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }).optional(),
});


export type TCreateItemProductVariant = z.infer<typeof CreateItemProductVariantSchema>;
export type TCreateItemProductVariants = z.infer<typeof CreateItemProductVariantsSchema>;
export type TCreateComboProduct = z.infer<typeof CreateComboProductSchema>;
export type TUpdateComboProduct = z.infer<typeof UpdateComboProductSchema>;
export type TUpdateComboProductItem = z.infer<typeof UpdateComboProductItemSchema>;
export type TAddItemToComboProduct = z.infer<typeof AddItemToComboProductSchema>;
export type TComboProductItem = z.infer<typeof ComboProductItemSchema>;
export type TComboProduct = z.infer<typeof ComboProductSchema>;


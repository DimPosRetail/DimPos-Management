import { z } from "zod";
import { IngredientSchema } from "./ingredients.schema";
// import { ProductImageSchema } from "./product.schema";

export const RecipeItemSchema = z.object({
    id: z.string().uuid(),
    quantity: z.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
    ingredient: IngredientSchema.omit({
        description: true,
    })
})

export const ProductVariantSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number( {message: "Giá phải là số"} ).min(0),    
    isActive: z.boolean(),
    size: z.string().nullable(),
    sku: z.string().nullable(),
    categoryId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    productImages: z.array(z.object({
        id: z.string().uuid(),
        imageUrl: z.string().url(),
        isMainImage: z.boolean(),
        altText: z.string().optional(),
    })).optional(),
    recipeItems: z.array(RecipeItemSchema).optional(),
});

export const CreateProductVariantSchema = z.object({
    code: z.string({ message: "Mã của biến thể sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mã của biến thể sản phẩm phải có ít nhất 1 ký tự" }).max(50, { message: "Mã của biến thể sản phẩm không được vượt quá 50 ký tự" }),
    name: z.string({ message: "Tên của biến thể sản phẩm không được bỏ trống" }).trim().min(1, { message: "Tên của biến thể sản phẩm phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của biến thể sản phẩm không được vượt quá 200 ký tự" }),
    description: z.string().nullable(),
    sku: z.string({message: "Mã SKU của biến thể sản phẩm không được bỏ trống"}).trim().min(1, { message: "Mã SKU của biến thể sản phẩm có ít nhất 1 ký tự" }).max(100, { message: "Mã SKU của biến thể sản phẩm không được vượt quá 100 ký tự" }).optional(),
    brandPrice: z.number({message: "Giá của biến thể sản phẩm không được bỏ trống"}).min(1, { message: "Giá của biến thể sản phẩm phải lớn hơn 0" }),
    size: z.string({message: "Kích thước của biến thể sản phẩm không được bỏ trống"}).trim().min(1, { message: "Kích thước của biến thể sản phẩm không được bỏ trống" }).max(50, { message: "Kích thước của biến thể sản phẩm không được vượt quá 50 ký tự" }),
    displayOrder: z.number({message: "Thứ tự hiển thị phải là số"}).int({message: "Thứ tự hiển thị phải là số nguyên"}).nonnegative({message: "Thứ tự hiển thị phải là số dương"}).optional(),
});

export const AddProductVariantSchema = z.object({
    code: z.string({ message: "Mã của biến thể sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mã của biến thể sản phẩm phải có ít nhất 1 ký tự" }).max(50, { message: "Mã của biến thể sản phẩm không được vượt quá 50 ký tự" }),
    name: z.string({ message: "Tên của biến thể sản phẩm không được bỏ trống" }).trim().min(1, { message: "Tên của biến thể sản phẩm phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của biến thể sản phẩm không được vượt quá 200 ký tự" }),
    description: z.string().nullable(),
    sku: z.string({message: "Mã SKU của biến thể sản phẩm không được bỏ trống"}).trim().min(1, { message: "Mã SKU của biến thể sản phẩm có ít nhất 1 ký tự" }).max(100, { message: "Mã SKU của biến thể sản phẩm không được vượt quá 100 ký tự" }).optional(),
    price: z.number({message: "Giá của biến thể sản phẩm không được bỏ trống"}).min(1, { message: "Giá của biến thể sản phẩm phải lớn hơn 0" }),
    size: z.string({message: "Kích thước của biến thể sản phẩm không được bỏ trống"}).trim().min(1, { message: "Kích thước của biến thể sản phẩm không được bỏ trống" }).max(50, { message: "Kích thước của biến thể sản phẩm không được vượt quá 50 ký tự" }),
    displayOrder: z.number().int().optional(),
});

export const UpdateProductVariantSchema = z.object({
    code: z.string(),
    name: z.string({ message: "Tên của biến thể sản phẩm không được bỏ trống" }).trim().min(1, { message: "Tên của biến thể sản phẩm phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của biến thể sản phẩm không được vượt quá 200 ký tự" }),
    price: z.number().min(0, { message: "Giá brand của biến thể sản phẩm không được bỏ trống" }),
    isActive: z.boolean(),
    size: z.string().nullable(),
    sku: z.string({message: "Mã SKU của biến thể sản phẩm không được bỏ trống"}).trim().min(1, { message: "Mã SKU của biến thể sản phẩm có ít nhất 1 ký tự" }).max(100, { message: "Mã SKU của biến thể sản phẩm không được vượt quá 100 ký tự" }).optional(),
    recipeItems: z.array(z.object({
        id: z.string().uuid().optional(),
        quantity: z.number().min(1, { message: "Số lượng phải lớn hơn 0" }).optional(),
    })).optional(),
    displayOrder: z.number({message: "Thứ tự hiển thị phải là số"}).int({message: "Thứ tự hiển thị phải là số nguyên"}).nonnegative({message: "Thứ tự hiển thị phải là số dương"}),
});



export const RequestRecipeItemSchema = z.object({
    quantity: z.number({message:"Số lượng không được để trống"}).min(0, { message: "Số lượng phải lớn hơn hoặc bằng 0" }),
    ingredientId: z.string({message: "Vui lòng chọn thành phần"}).uuid({ message: "ID thành phần không hợp lệ" }),
});

export const RecipeItemForProductSchema = RequestRecipeItemSchema.extend({
    ingredientName: z.string().optional(),
    ingredientCode: z.string().optional(),
    ingredientMeasureUnit: z.string().optional(),
})

export const PriceProductHistorySchema = z.object({
    id: z.string().uuid(),
    productVariantId: z.string().uuid(),
    currencyCode: z.string(),
    oldPrice: z.number().min(0),
    newPrice: z.number().min(0),
    changedAt: z.string(),
    changedBy: z.string().uuid(),
});

export type TPriceProductHistory = z.infer<typeof PriceProductHistorySchema>;
export type TProductVariantResponse = z.infer<typeof ProductVariantSchema>;
export type TCreateProductVariantRequest = z.infer<typeof CreateProductVariantSchema>;
export type TAddProductVariantRequest = z.infer<typeof AddProductVariantSchema>;
export type TUpdateProductVariantRequest = z.infer<typeof UpdateProductVariantSchema>;
export type TRecipeItemResponse = z.infer<typeof RecipeItemSchema>;
export type TRecipeItemForProduct = z.infer<typeof RecipeItemForProductSchema>;
export type TRequestRecipeItem = z.infer<typeof RequestRecipeItemSchema>;


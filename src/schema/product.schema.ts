import { z } from "zod";
import { ProductExtraSchema } from "./product-extra.schema";
import { CreateProductVariantSchema, ProductVariantSchema } from "./product-variant.schema";

export const allowedExtensions = [".jpeg", ".png", ".jpg", ".gif", ".bmp", ".webp"];

export const ProductImageSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().url(),
  isMainImage: z.boolean(),
});
export const ModifierOptionSchema = z.object({
  id: z.string({ message: "ID không hợp lệ" }).uuid({ message: "ID phải là UUID hợp lệ" }),
  name: z.string({ message: "Tên tùy chọn không hợp lệ" }).trim()
    .max(100, { message: "Tên tùy chọn không được quá 100 ký tự" })
    .min(1, { message: "Tên tùy chọn phải có ít nhất 1 ký tự" }),

  description: z.string({ message: "Mô tả không hợp lệ" }).trim()
    .max(500, { message: "Mô tả không được quá 500 ký tự" })
    .optional(),

  isActive: z.boolean({ message: "Trạng thái hoạt động là bắt buộc" }),
});

export const CreateModifierGroupSchema = z.object({
  name: z.string({ message: "Tên nhóm tùy chọn không được để trống" }).trim()
    .min(1, { message: "Tên nhóm tùy chọn phải có ít nhất 1 ký tự" })
    .max(100, { message: "Tên nhóm tùy chọn không được quá 100 ký tự" }),

  description: z.string({ message: "Mô tả không hợp lệ" }).trim()
    .max(500, { message: "Mô tả không được quá 500 ký tự" })
    .nullable()
    .optional(),

  selectedType: z.union([
    z.literal(0, { message: "Hình thức chọn phải là Một hoặc Nhiều" }),
    z.literal(1, { message: "Hình thức chọn phải là Một hoặc Nhiều" }),
  ], {
    invalid_type_error: "Hình thức chọn phải là 1 (Một) hoặc 2 (Nhiều)"
  }),

  displayOrder: z.number({ message: "Thứ tự hiển thị không hợp lệ" })
    .int({ message: "Thứ tự hiển thị phải là số nguyên" })
    .min(0, { message: "Thứ tự hiển thị phải ≥ 0" }),

  isActive: z.boolean({ message: "Trạng thái hoạt động là bắt buộc" }),

  modifierOptions: z
    .array(ModifierOptionSchema.omit({ id: true }), {
      invalid_type_error: "Danh sách tùy chọn phải là một mảng hợp lệ",
    })
    .nullable()
    .optional(),
});
export const ModifierGroupSchema = z.object({
  id: z.string({ message: "ID không hợp lệ" }).uuid({ message: "ID phải là UUID hợp lệ" }),

  name: z.string({ message: "Tên nhóm tùy chọn không hợp lệ" }).trim()
    .min(1, { message: "Tên nhóm tùy chọn không được để trống" })
    .max(100, { message: "Tên nhóm tùy chọn không được quá 100 ký tự" }),

  description: z.string({ message: "Mô tả không hợp lệ" }).trim()
    .max(500, { message: "Mô tả không được quá 500 ký tự" })
    .optional(),

  selectedType: z.union([
    z.literal(0, { message: "Hình thức chọn phải là Một hoặc Nhiều" }),
    z.literal(1, { message: "Hình thức chọn phải là Một hoặc Nhiều" }),
  ], {
    invalid_type_error: "Hình thức chọn phải là 1 (Một) hoặc 2 (Nhiều)"
  }),

  displayOrder: z.number({ message: "Thứ tự hiển thị không hợp lệ" })
    .int({ message: "Thứ tự hiển thị phải là số nguyên" })
    .min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }),

  isActive: z.boolean({ message: "Trạng thái hoạt động là bắt buộc" }),

  modifierOptions: z
    .array(ModifierOptionSchema)
    .nullable()
    .optional(),
});

export const UpdateModifierGroupSchema = ModifierGroupSchema.omit({
  id: true,
  modifierOptions: true,
})

export const CreateProductImageSchema = z.object({
  image: z.any().refine(file => {
    if (!file) return true;
    if (typeof file !== "object" || !("name" in file)) return false;
    const extension = (file.name as string).toLowerCase().split(".").pop();
    return allowedExtensions.includes(`.${extension}`);
  }, {
    message: "Chỉ các định dạng tệp .jpeg, .png, .jpg, .gif, .bmp, .webp được phép tải lên.",
  }),
  isMainImage: z.boolean(),
});
// const SaleType = z.union([z.literal(0), z.literal(1)]);
export const CreateProductSchema = z.object({
  code: z.string({ message: "Mã của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mã của sản phẩm phải có ít nhất 1 ký tự" }).max(50, { message: "Mã của sản phẩm không được vượt quá 50 ký tự  " }),
  sku: z.string({ message: "Mã SKU của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mã SKU của sản phẩm phải có ít nhất 1 ký tự" }).max(100, { message: "SKU của sản phẩm không được vượt quá 100 ký tự" }).optional(),
  name: z.string({ message: "Tên của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Tên của sản phẩm phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của sản phẩm không được vượt quá 200 ký tự" }),
  price: z.number({ message: "Vui lòng nhập giá là số" }).min(0, { message: "Giá của sản phẩm phải lớn hơn 0" }),
  description: z.string({ message: "Mô tả của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mô tả của sản phẩm phải có ít nhất 1 ký tự" }).max(1000, { message: "Mô tả của sản phẩm không được vượt quá 1000 ký tự" }),
  displayOrder: z.number({ message: "Thứ tự hiển thị không bỏ trống" }).int().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }),
  note: z.string().nullable().optional(),
  categoryId: z.string().uuid({ message: "Danh mục không hợp lệ" }),
  productImages: z.array(CreateProductImageSchema).nullable(),
  productVariants: z.array(CreateProductVariantSchema).nullable().optional(),
  modifierGroups: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
  })).nullable().optional(),
  isHasVariants: z.boolean().default(false),
}).superRefine((data, ctx) => {
  // If isHasVariants is false, sku must be provided
  if (!data.isHasVariants && (!data.sku || data.sku.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mã SKU là bắt buộc khi sản phẩm không có biến thể",
      path: ["sku"]
    });
  }
  
  // If isHasVariants is true, productVariants must have at least 1 item
  if (data.isHasVariants && (!data.productVariants || data.productVariants.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sản phẩm phải có ít nhất 1 biến thể khi có biến thể được bật",
      path: ["productVariants"]
    });
  }
});
// const ProductStatusEnum = z.union([z.literal(0), z.literal(1)]);
export const UpdateProductSchema = z.object({
  code: z.string({ message: "Mã của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mã của sản phẩm phải có ít nhất 1 ký tự" }).max(50, { message: "Mã của sản phẩm không được vượt quá 50 ký tự  " }),
  name: z.string({ message: "Tên của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Tên của sản phẩm phải có ít nhất 1 ký tự" }).max(200, { message: "Tên của sản phẩm không được vượt quá 200 ký tự" }),
  description: z.string({ message: "Mô tả của sản phẩm không được bỏ trống" }).trim().min(1, { message: "Mô tả của sản phẩm phải có ít nhất 1 ký tự" }).max(1000, { message: "Mô tả của sản phẩm không được vượt quá 1000 ký tự" }),
  displayOrder: z.number({ message: "Thứ tự hiển thị không bỏ trống" }).int().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }),
  note: z.string().nullable().optional(),
  id: z.string().uuid(),
  productImages: z.array(ProductImageSchema).nullable(),
  newProductImages: z.array(CreateProductImageSchema).nullable(),
  isHasVariants: z.boolean(),
  // status: ProductStatusEnum,
  category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      code: z.string(),
      description: z.string().optional(),
      type: z.number(),
      displayOrder: z.number(),
      pictureUrl: z.string().nullable().optional(),
      hasChildCategory: z.boolean(),
      status: z.number(),
    })
    .nullable()
    .optional(),
  productVariants: z.array(
    ProductVariantSchema
  ).nullable().optional(),
});
export const UpdateProductModifierOptionSchema = z.object({
  productId: z.string().uuid(),
  modifierGroupIds: z.array(z.string().uuid()).optional(),
});
// export const UpdateModifierGroupSchema = CreateModifierGroupSchema.extend({
//   id: z.string().uuid({ message: "ID không hợp lệ" }),
// });


export const ProductSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  isHasVariants: z.boolean().default(false),
  // status: z.number().int().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  note: z.string().optional(),
  createdDate: z.string().datetime().optional(),
  lastModifiedDate: z.string().datetime().optional(),
  productVariants: z.array(ProductVariantSchema).optional(),
  productImages: z.array(ProductImageSchema).optional(),
  modifierGroup: z.array(ModifierGroupSchema).optional(),
  productExtras: z.array(ProductExtraSchema).optional(),
});

export const UpdateModifierGroupProductSchema = z.object({
  modifierGroupIds: z.array(z.string().uuid())
})

export const AddExtraProductSchema = z.object({
    productVariantItemIds: z.array(z.string().uuid()),
})

export const UpdateModifierOptionSchema = ModifierOptionSchema.omit({ id: true });
export type TProductImageResponse = z.infer<typeof ProductImageSchema>;
export type TProductResponse = z.infer<typeof ProductSchema>;
export type TModifierOptionResponse = z.infer<typeof ModifierOptionSchema>;
export type TModifierGroupResponse = z.infer<typeof ModifierGroupSchema>;

export type TCreateModifierGroupRequest = z.infer<typeof CreateModifierGroupSchema>;
export type TUpdateModifierGroupRequest = z.infer<typeof UpdateModifierGroupSchema>;
export type TUpdateModifierOptionRequest = z.infer<typeof UpdateModifierOptionSchema>;
export type TProductRequest = z.infer<typeof CreateProductSchema>;
export type TUpdateProductRequest = z.infer<typeof UpdateProductSchema>;
export type TUpdateModifierGroupProductRequest = z.infer<typeof UpdateModifierGroupProductSchema>;
export type TProductModifierOptionRequest = z.infer<typeof UpdateProductModifierOptionSchema>;
export type TAddExtraProductRequest = z.infer<typeof AddExtraProductSchema>;

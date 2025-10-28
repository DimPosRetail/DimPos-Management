import { z } from "zod";
import { CreateProductImageSchema, ProductImageSchema } from "./product.schema";

export const PurchasableProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim(),
  code: z.string().trim(),
  sku: z.string().trim(),
  price: z.number(),
  description: z.string().trim().nullable(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
  productImages: z.array(ProductImageSchema).nullable().optional(),
});
export const CreatePurchasableProductRequestSchema = z.object({
  code: z.string({ message: "Mã sản phẩm không được để trống" }).trim().min(1, { message: "Mã sản phẩm không được để trống" }),
  name: z.string({ message: "Tên sản phẩm không được để trống" }).trim().min(1, { message: "Tên sản phẩm không được để trống" }),
  description: z.string().trim().nullable().optional(),
  displayOrder: z.number({ message: "Thứ tự hiển thị không hợp lệ" })
    .int({ message: "Thứ tự hiển thị phải là số nguyên" }).nonnegative({ message: "Thứ tự hiển thị phải ≥ 0" })
    .min(0, { message: "Thứ tự hiển thị phải ≥ 0" }),
  note: z.string().trim().nullable().optional(),
  sku: z.string({ message: "Mã Sku không được để trống" }).trim().min(1, { message: "Mã Sku không được để trống" }), 
  price: z.number({ message: "Giá phải là một số" }).int().nonnegative({ message: "Giá phải lớn hơn  0" })
    .min(1, { message: "Giá phải lớn hơn  0" }),
  productImages: z.array(CreateProductImageSchema).nullable().optional(),
});
export const UpdatePurchasableProductRequestSchema = z.object({
  id: z.string().uuid(),
    code: z.string({ message: "Tên sản phẩm không được để trống" }).trim().min(1, { message: "Mã sản phẩm không được để trống" }),
  name: z.string({ message: "Mã sản phẩm không được để trống" }).trim().min(1, { message: "Tên sản phẩm không được để trống" }),
  description: z.string().trim().nullable().optional(),
  displayOrder: z.number({ message: "Thứ tự hiển thị không hợp lệ" })
    .int({ message: "Thứ tự hiển thị phải là số nguyên" }).nonnegative({ message: "Thứ tự hiển thị phải ≥ 0" })
    .min(0, { message: "Thứ tự hiển thị phải ≥ 0" }),
  note: z.string().trim().nullable().optional(),
  sku: z.string({ message: "Mã Sku không được để trống" }).trim().min(1, { message: "Mã Sku không được để trống" }), 
  price: z.number({ message: "Giá phải là một số" }).int().nonnegative({ message: "Giá phải lớn hơn  0" })
    .min(1, { message: "Giá phải lớn hơn  0" }),
  isActive: z.boolean(),
  existInternalProductImages: z.array(ProductImageSchema).nullable(),
  newInternalProductImages: z.array(CreateProductImageSchema).nullable(),
});

export function mapPurchasableProductToUpdateRequest(
  internalProduct: TPurchasableProduct
): TUpdatePurchasableProductRequest {
  return {
    id: internalProduct.id,
    code: internalProduct.code,
    name: internalProduct.name,
    sku: internalProduct.sku,
    price: internalProduct.price,
    description: internalProduct.description,
    displayOrder: internalProduct.displayOrder,
    isActive: internalProduct.isActive ?? false,
    existInternalProductImages: internalProduct.productImages || [],
    newInternalProductImages: [],
  };
}

export type TPurchasableProduct = z.infer<typeof PurchasableProductSchema>;
export type TCreatePurchasableProductRequest = z.infer<typeof CreatePurchasableProductRequestSchema>;
export type TUpdatePurchasableProductRequest = z.infer<typeof UpdatePurchasableProductRequestSchema>;
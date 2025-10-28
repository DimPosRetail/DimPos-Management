import { CategoryStatusEnum } from "@/types/enums/category-status.enum";
import { CategoryTypeEnum } from "@/types/enums/category-type.enum";
import { z } from "zod";

export const allowedExtensions = [".jpeg", ".png", ".jpg", ".gif", ".bmp", ".webp"];

export const CategoryResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(CategoryTypeEnum),
  displayOrder: z.number().int(),
  pictureUrl: z.string().url().optional(),
  hasChildCategory: z.boolean(),
  parentCategory: z
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
  status: z.nativeEnum(CategoryStatusEnum),
});

export const CreateCategorySchema = z.object({
  code: z.string().trim()
    .min(1, { message: "Mã danh mục không được để trống" }),

  name: z.string().trim()
    .min(1, { message: "Tên của danh mục không được ít hơn 1 ký tự" })
    .max(200, { message: "Tên của danh mục không được quá 200 ký tự" })
    .nonempty({ message: "Tên của danh mục không được để trống" }),

  description: z.string()
    .max(1000, { message: "Mô tả của danh mục không được quá 1000 ký tự" })
    .optional(),

  type: z.nativeEnum(CategoryTypeEnum),

  status: z.nativeEnum(CategoryStatusEnum),

  displayOrder: z.number()
    .int({ message: "Thứ tự hiển thị phải là số nguyên" })
    .min(0, { message: "Thứ tự hiển thị phải là số dương hoặc bằng 0" })
    .optional(),

  parentCategoryId: z.string()
    .uuid({ message: "ID danh mục cha không hợp lệ" })
    .optional(),

  hasChildCategory: z.boolean().optional(),

  image: z
    .any()
    .refine(file => {
      if (!file) return true;
      if (typeof file !== "object" || !("name" in file)) return false;
      const extension = (file.name as string).toLowerCase().split(".").pop();
      return allowedExtensions.includes(`.${extension}`);
    }, {
      message: "Chỉ các định dạng tệp .jpeg, .png, .jpg, .gif, .bmp, .webp được phép tải lên.",
    })
    .optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.extend({
  id: z.string().uuid({ message: "ID không hợp lệ" }),
});

export type TCategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type TCreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type TUpdateCategoryRequest = z.infer<typeof UpdateCategorySchema>;
export const defaultCategoryResponse: TCategoryResponse = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "",
  code: "",
  description: "",
  type: CategoryTypeEnum.Parent,
  displayOrder: 0,
  pictureUrl: "",
  hasChildCategory: false,
  parentCategory: null,
  status: CategoryStatusEnum.Active,
};
export function mapCategoryResponseToUpdateRequest(
  data: TCategoryResponse
): TUpdateCategoryRequest {
  return {
    id: data.id,
    name: data.name,
    code: data.code,
    description: data.description ?? "",
    type: data.type,
    displayOrder: data.displayOrder,
    status: data.status,
    parentCategoryId: data.parentCategory?.id ?? undefined,
    hasChildCategory: data.hasChildCategory,
    image: undefined,
  };
}
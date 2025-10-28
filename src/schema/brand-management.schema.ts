import { z } from "zod";

export const CreateBrandSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Mã thương hiệu không được để trống" })
    .max(50, { message: "Mã thương hiệu không được vượt quá 50 ký tự" }),

  name: z
    .string()
    .min(1, { message: "Tên thương hiệu không được để trống" })
    .max(100, { message: "Tên thương hiệu không được vượt quá 100 ký tự" }),

  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .max(100, { message: "Email không được vượt quá 100 ký tự" }),

  address: z
    .string()
    .min(1, { message: "Địa chỉ không được để trống" })
    .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),

  phone: z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .max(15, { message: "Số điện thoại không được vượt quá 15 ký tự" }),

  picture: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;
        if (typeof file !== "object" || !("name" in file)) return false;
        const extension = (file.name as string).toLowerCase().split(".").pop();
        return ["jpeg", "png", "jpg", "gif", "bmp", "webp"].includes(extension ?? "");
      },
      { message: "Chỉ chấp nhận các định dạng ảnh jpeg, png, jpg, gif, bmp, webp" }
    )
    .optional(),

  username: z
    .string()
    .min(1, { message: "Tên đăng nhập không được để trống" })
    .max(50, { message: "Tên đăng nhập không được vượt quá 50 ký tự" }),

  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
});

export const UpdateBrandSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Mã thương hiệu không được để trống" })
    .max(50, { message: "Mã thương hiệu không được vượt quá 50 ký tự" }),

  name: z
    .string()
    .min(1, { message: "Tên thương hiệu không được để trống" })
    .max(100, { message: "Tên thương hiệu không được vượt quá 100 ký tự" }),

  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .max(100, { message: "Email không được vượt quá 100 ký tự" }),

  address: z
    .string()
    .min(1, { message: "Địa chỉ không được để trống" })
    .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),

  phone: z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .max(15, { message: "Số điện thoại không được vượt quá 15 ký tự" }),

  picture: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;
        if (typeof file !== "object" || !("name" in file)) return false;
        const extension = (file.name as string).toLowerCase().split(".").pop();
        return ["jpeg", "png", "jpg", "gif", "bmp", "webp"].includes(extension ?? "");
      },
      { message: "Chỉ chấp nhận các định dạng ảnh jpeg, png, jpg, gif, bmp, webp" }
    )
    .optional(),
});

export const BrandSchema = z.object({
  id: z.string().uuid({ message: "ID không hợp lệ" }),

  code: z
    .string()
    .min(1, { message: "Mã thương hiệu không được để trống" })
    .max(50, { message: "Mã thương hiệu không được vượt quá 50 ký tự" }),

  name: z
    .string()
    .min(1, { message: "Tên thương hiệu không được để trống" })
    .max(100, { message: "Tên thương hiệu không được vượt quá 100 ký tự" }),

  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .max(100, { message: "Email không được vượt quá 100 ký tự" }),

  address: z
    .string()
    .min(1, { message: "Địa chỉ không được để trống" })
    .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),

  phone: z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .max(15, { message: "Số điện thoại không được vượt quá 15 ký tự" }),

  pictureUrl: z
    .string()
    .url({ message: "URL hình ảnh không hợp lệ" })
    .nullable()
    .optional(),

  archivedAt: z
    .string()
    .datetime({ message: "Ngày lưu trữ không hợp lệ" })
    .nullable()
    .optional(),

  status: z
    .number({ invalid_type_error: "Trạng thái phải là số" })
    .int({ message: "Trạng thái phải là số nguyên" }),

  createdDate: z
    .string()
    .datetime({ message: "Ngày tạo không hợp lệ" }),

  lastModifiedDate: z
    .string()
    .datetime({ message: "Ngày chỉnh sửa không hợp lệ" })
    .nullable()
    .optional(),
});

export type TCreateBrandRequest = z.infer<typeof CreateBrandSchema>;
export type TUpdateBrandRequest = z.infer<typeof UpdateBrandSchema>;
export type TBrandResponse = z.infer<typeof BrandSchema>;

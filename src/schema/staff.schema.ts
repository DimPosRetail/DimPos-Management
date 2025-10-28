import { z } from "zod";
const optionalEmailSchema = z
  .string()
  .nullable()
  .refine(
    (val) => val === null || val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    { message: "Email không đúng định dạng" }
  );

export const StaffSchema = z.object({
  id: z.string(),
  code: z.string(),
  username: z.string(),
  email: z.string(),
  status: z.number(),
  assignAt: z.string(), 
});

export const CreateAccountSchema = z.object({
  code: z.string().min(1, "Mã nhân viên không được để trống"),
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  email: optionalEmailSchema,
});

export const UpdateStaffSchema = z.object({
  code: z.string().nullable(),
  username: z.string().nullable(),
  password: z.string().nullable(),
  email: optionalEmailSchema,
  status: z.number().nullable(),
});

export type TUpdateStaff = z.infer<typeof UpdateStaffSchema>;
export type TCreateAccount = z.infer<typeof CreateAccountSchema>;
export type TStaff = z.infer<typeof StaffSchema>;

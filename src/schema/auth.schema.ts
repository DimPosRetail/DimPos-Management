import { z } from "zod"

export const LoginSchema = z.object( {
    username: z.string().min( 1, { message: "Tên đăng nhập không được bỏ trống" } ).max( 50, { message: "Tên đăng nhập không được quá 50 ký tự" } ),
    password: z.string().min( 1, { message: "Mật khẩu không được bỏ trống" } ).max( 50, { message: "Mật khẩu không được quá 50 ký tự" } ),
} ).strict();

export const AuthResponseSchema = z.object({
    accountId: z.string(),
    username: z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
});


export type TLoginRequest = z.TypeOf<typeof LoginSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;


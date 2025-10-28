import { z } from "zod";
import { BrandMenuSchema } from "./menu.schema";
import { ProductVariantSchema } from "./product-variant.schema";
const TaxRateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rate: z.number(),
});

export const StoreSchema = z.object({
    id: z.string().uuid(),
    code: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    shortName: z.string().nullable().optional(),
    description: z.string().max(500, { message: "Mô tả không được quá 500 ký tự" }).nullable().optional(),
    address: z.string().nullable().optional(),
    latitude: z.string().nullable().optional(),
    longitude: z.string().nullable().optional(),
    wifiName: z.string().max(100, { message: "Tên WiFi không được quá 100 ký tự" }).nullable().optional(),
    wifiPassword: z.string().max(100, { message: "Mật khẩu WiFi không được quá 100 ký tự" }).nullable().optional(),
    localPasscode: z.string().max(20, { message: "Mã truy cập nội bộ không được quá 20 ký tự" }).nullable().optional(),
    managerName: z.string().nullable().optional(),
    type: z.number().int().optional(),
    username: z.string().max(50, { message: "Tên đăng nhập không được quá 50 ký tự" }).optional(),
    password: z.string().max(50, { message: "Mật khẩu không được quá 50 ký tự" }).optional(),
    startingStoreCashLending: z.number({message: "Số tiền không được bỏ trống"}).min(1, { message: "Tiền mặt không bé hơn 1" }).optional(),
    status: z.number().int().optional(),
});

export const CreateStoreRequest = z.object({
    code: z.string({ message: "Mã cửa hàng không được bỏ trống" }).trim().min(1, { message: "Mã cửa hàng không được bỏ trống" }).max(50, { message: "Mã cửa hàng không được quá 50 ký tự" }),
    name: z.string({ message: "Tên cửa hàng không được bỏ trống" }).trim().min(1, { message: "Tên cửa hàng không được bỏ trống" }).max(100, { message: "Tên cửa hàng không được quá 100 ký tự" }),
    phone: z.string({ message: "Số điện thoại không được bỏ trống" }).trim().max(15, { message: "Số điện thoại không được quá 15 ký tự" }).optional(),
    email: z.string({ message: "Email không hợp lệ" }).trim().email({ message: "Email không hợp lệ" }).max(100, { message: "Email không được quá 100 ký tự" }).optional(),
    shortName: z.string().trim().max(50, { message: "Tên viết tắt không được quá 50 ký tự" }).optional(),
    description: z.string().trim().max(500, { message: "Mô tả không được quá 500 ký tự" }).nullable().optional(),
    address: z.string({ message: "Địa chỉ không được bỏ trống" }).trim().min(1, { message: "Địa chỉ không được bỏ trống" }).max(200, { message: "Địa chỉ không được quá 200 ký tự" }),
    latitude: z.string().trim().nullable().optional(),
    longitude: z.string().trim().nullable().optional(),
    wifiName: z.string().trim().max(100, { message: "Tên WiFi không được quá 100 ký tự" }).nullable().optional(),
    wifiPassword: z.string().trim().max(100, { message: "Mật khẩu WiFi không được quá 100 ký tự" }).nullable().optional(),
    localPasscode: z.string().trim().max(20, { message: "Mã truy cập nội bộ không được quá 20 ký tự" }).nullable().optional(),
    managerName: z.string().trim().max(100, { message: "Tên quản lý không được quá 100 ký tự" }).optional(),
    type: z.number().nonnegative().int().optional(),
    startingStoreCashLending: z.number({message: "Tiền mặt phải là số"}).nonnegative().min(1, {message: "Tiền mặt không bé hơn 1"}),
    username: z.string({ message: "Tên đăng nhập không được bỏ trống" }).trim().min(1, { message: "Tên đăng nhập không được bỏ trống" }).max(50, { message: "Tên đăng nhập không được quá 50 ký tự" }),
    password: z.string( { message: "Mật khẩu không được bỏ trống" }).trim().min(1, { message: "Mật khẩu không được bỏ trống" }).max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
});

export const StoreResponseSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    shortName: z.string(),
    description: z.string(),
    address: z.string(),
    latitude: z.string().nullable(),
    longitude: z.string().nullable(),
    status: z.number(), 
    wifiName: z.string().nullable(),
    wifiPassword: z.string().nullable(),
    index: z.number().nullable(),
    localPasscode: z.string().nullable(),
    managerName: z.string().nullable(),
    startingStoreCashLending: z.number(),
    type: z.number(), 
    createdDate: z.string(), 
    lastModifiedDate: z.string(),
    taxRate: TaxRateSchema.optional().nullable(),
    pictureUrl: z.string().url().optional(),
});


export const StoreMenuSchema = z.object({
    id: z.string().uuid(),
    isActiveAtStore: z.boolean(),
    createdDate: z.string(),
    lastModifiedDate: z.string().optional(),
    brandMenu: BrandMenuSchema.omit({
        productVariants: true,
        stores: true,
    })
});

export const DetailStoreMenuSchema = StoreMenuSchema.extend({
    storeMenuItems: z.array(z.object({
        id: z.string().uuid(),
        isActiveAtStore: z.boolean(),
        createdDate: z.string(),
        lastModifiedDate: z.string().optional(),
        productVariant: ProductVariantSchema.omit({
            categoryId: true,
            productId: true,
        })
    })).optional(),
})

export const UpdateDetailStoreMenuSchema = z.object({
    productVariantIds: z.array(z.string().uuid()).optional(),
})

export const StoreProductSchema = z.object({
    id: z.string().uuid(),
    currencyCode: z.string(),
    overridePrice: z.number().min(0, { message: "Giá không được nhỏ hơn 0" }).nullable(),
    productVariant: ProductVariantSchema.omit({
        categoryId: true,
        productId: true,
    }).extend({
        imageUrl: z.string().nullable(),
    }),
})

export const UpdateStoreProductPriceSchema = z.object({
    currencyCode: z.string({message: "Mã tiền tệ không được bỏ trống"}).max(10, { message: "Mã tiền tệ không được quá 10 ký tự" }),
    overridePrice: z.number({message: "Giá không được bỏ trống "}).min(1, { message: "Giá không được nhỏ hơn 0" }),
})

export const UpdateStoreRequestSchema = z.object({
  code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  shortName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  wifiName: z.string().nullable().optional(), 
  wifiPassword: z.string().nullable().optional(),
  index: z.number().nullable().optional(),
  localPasscode: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  type: z.number().nullable().optional(),
  startingStoreCashLending: z.number().nullable().optional(),
  password: z.string().nullable().optional(),
});

export const StoreTaxRateSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, { message: "Tên thuế không được để trống" }).max(100, { message: "Tên thuế không được quá 100 ký tự" }),
    rate: z.number({ message: "Tỷ lệ thuế phải là số" }).min(0, { message: "Tỷ lệ thuế không được nhỏ hơn 0" }).max(100, { message: "Tỷ lệ thuế không được lớn hơn 100" }),
    isActive: z.boolean(),
    createdDate: z.string(),
    lastModifiedDate: z.string().optional(),
})

export const AddStoreTaxRateRequestSchema = StoreTaxRateSchema.pick({
    name: true,
    rate: true,
})

export const UpdateStoreTaxRateRequestSchema = StoreTaxRateSchema.omit({
    id: true,
    createdDate: true,
    lastModifiedDate: true,
});

export type TStoreResponse = z.infer<typeof StoreResponseSchema>;
export type TStore = z.infer<typeof StoreSchema>;
export type TCreateStoreRequest = z.infer<typeof CreateStoreRequest>;
export type TStoreMenu = z.infer<typeof StoreMenuSchema>;
export type TDetailStoreMenu = z.infer<typeof DetailStoreMenuSchema>;
export type TUpdateDetailStoreMenu = z.infer<typeof UpdateDetailStoreMenuSchema>;
export type TStoreProduct = z.infer<typeof StoreProductSchema>;
export type TUpdateStoreProductPrice = z.infer<typeof UpdateStoreProductPriceSchema>;
export type TTaxRate = z.infer<typeof TaxRateSchema>;
export type TUpdateStoreRequest = z.infer<typeof UpdateStoreRequestSchema>;

export type TStoreTaxRate = z.infer<typeof StoreTaxRateSchema>;
export type TAddStoreTaxRateRequest = z.infer<typeof AddStoreTaxRateRequestSchema>;
export type TUpdateStoreTaxRateRequest = z.infer<typeof UpdateStoreTaxRateRequestSchema>;
import { PaymentMethodTypeEnum } from "@/types/enums/payment-method-type-enum";
import { z } from "zod";
const allowedExtensions = [".jpeg", ".png", ".jpg", ".gif", ".bmp", ".webp"];
export const StorePaymentMethodConfigSchema = z.object({
  id: z.string(),
  systemPaymentMethodId: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  paymentMethod: z.number(),
  isActiveByStore: z.boolean(),
  createdDate: z.string(),
  lastModifiedDate: z.string().nullable(),
});

export const UpdateStorePaymentMethodStatusSchema = z.object({
  isActiveByStore: z.boolean(),
});

export const AddPaymentMethodSchema = z.object({
  systemPaymentMethodId: z.string().uuid(),
  credentialsConfigAtStore: z.string().nullable().optional(),
});

export const MPosRequestSchema = z.object({
  merchantId: z.number({message:"Merchant ID không được bỏ trống"}).positive({message:"Merchant ID phải là số dương"}),
  settings: z.object({
    secretKey: z.string({message:"Secret key không được bỏ trống"}).trim(),
    muid: z.string({message:"MUID không được bỏ trống"}).trim(),
    posId: z.string({message:"POS ID không được bỏ trống"}).trim(),
  }),
})

export const PayOsRequestSchema = z.object({
  clientId: z.string({message:"Client ID không được bỏ trống"}).trim(),
  apiKey: z.string({message:"API Key không được bỏ trống"}).trim(),
  checksumKey: z.string({message:"Checksum Key không được bỏ trống"}).trim(),
})

export const CreatePaymentMethodConfigSchema = z.object({
  systemPaymentMethodId: z.string({message:"Phương thức thanh toán không hợp lệ"}).uuid({message:"Phương thức thanh toán không hợp lệ"}),
  paymentMethodType: z.nativeEnum(PaymentMethodTypeEnum),
  mPosRequest: MPosRequestSchema.optional(),
  payOsRequest: PayOsRequestSchema.optional(),
}).superRefine((data, ctx) => {
    // Nếu paymentMethodType là QR_VIETQR, QR_EDC, CARD_EDC
    if (
      data.paymentMethodType === PaymentMethodTypeEnum.QR_VIETQR ||
      data.paymentMethodType === PaymentMethodTypeEnum.QR_EDC ||
      data.paymentMethodType === PaymentMethodTypeEnum.CARD_EDC
    ) {
      if (!data.mPosRequest) {
        ctx.addIssue({
          path: ["mPosRequest"],
          code: z.ZodIssueCode.custom,
          message: "Vui lòng điền các thông tin bắt buộc cho phương thức này",
        });
      }
    }

    // Nếu paymentMethodType là QR_PAYOS
    if (data.paymentMethodType === PaymentMethodTypeEnum.QR_PAYOS) {
      if (!data.payOsRequest) {
        ctx.addIssue({
          path: ["payOsRequest"],
          code: z.ZodIssueCode.custom,
          message: "Vui lòng điền các thông tin bắt buộc cho phương thức này",
        });
      }
    }
  });

export type TAddPaymentMethod = z.infer<typeof AddPaymentMethodSchema>;

export type TCreatePaymentMethodConfig = z.infer<typeof CreatePaymentMethodConfigSchema>;

export type TStorePaymentMethodConfig = z.infer<typeof StorePaymentMethodConfigSchema>;

export type TUpdateStorePaymentMethodStatus = z.infer<typeof UpdateStorePaymentMethodStatusSchema>;

export const UploadImageSchema = z.object({
  image: z.any().refine(file => {
    if (!file) return true; // cho phép không upload mới
    if (typeof file !== "object" || !("name" in file)) return false;
    const extension = (file.name as string).toLowerCase().split(".").pop();
    return allowedExtensions.includes(`.${extension}`);
  }, {
    message: "Chỉ các định dạng tệp .jpeg, .png, .jpg, .gif, .bmp, .webp được phép tải lên.",
  }),
  isMainImage: z.boolean(),
  altText: z.string().optional(),
});
export const SystemPaymentMethodSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  type: z.number(),
  logoUrl: z.string(),
  description: z.string(),
  isGloballyActive: z.boolean(),
  configurationSchema: z.string(),
  createdDate: z.string(),
  lastModifiedDate: z.string().nullable(),
});
export const UpdateSystemPaymentMethodSchema = z.object({
  code: z.string().min(1, "Mã không được để trống"),
  name: z.string().min(1, "Tên không được để trống"),
  type: z.number(),
  description: z.string().nullable().optional(),
  logo: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (typeof file !== "object" || !("name" in file)) return false;
      const extension = (file.name as string).toLowerCase().split(".").pop();
      return allowedExtensions.includes(`.${extension}`);
    }, {
      message: "Chỉ các định dạng tệp .jpeg, .png, .jpg, .gif, .bmp, .webp được phép tải lên.",
    }),
  isGloballyActive: z.boolean(),
  configurationSchema: z.string().optional(),
});


export type TSystemPaymentMethod = z.infer<typeof SystemPaymentMethodSchema>;
export type TUpdateSystemPaymentMethod = z.infer<typeof UpdateSystemPaymentMethodSchema>;
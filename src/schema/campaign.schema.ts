import { z } from "zod";
import { PromotionRuleBaseSchema } from "./promotion-rule.schema";
import { BrandStoreSchema } from "./menu.schema";

export const allowedExtensions = [".jpeg", ".png", ".jpg", ".gif", ".bmp", ".webp"];

export const CampaignResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  priority: z.number().nonnegative().int().min(0, { message: "Độ ưu tiên không được để trống" }),
  isActive: z.boolean(),
  maxTotalUsageLimit: z.number().int(),
  maxUsagePerCustomerLimit: z.number().int(),
  promotionRules: z.array(z.lazy(() => PromotionRuleBaseSchema)).nullable(),
  stores: z.array(BrandStoreSchema).nullable(),
});


const BaseCampaignSchema = z.object({
  name: z.string({message: "Tên của chiến dịch không được bỏ trống"}).trim()
    .min(1, { message: "Tên của chiến dịch không được ít hơn 1 ký tự" })
    .max(200, { message: "Tên của chiến dịch không được quá 200 ký tự" }),
  description: z.string().trim()
    .max(1000, { message: "Mô tả của chiến dịch không được quá 1000 ký tự" })
    .nullable().optional(),
  startDate: z.date({message: "Ngày bắt đầu không được bỏ trống"}),
  endDate: z.date({message: "Ngày kết thúc không được bỏ trống"}),
  isActive: z.boolean(),
  priority: z.number({message:"Độ ưu tiên phải là số"}).int().nonnegative().min(0, { message: "Độ ưu tiên không được để trống" }),
});

export const CreateCampaignSchema = BaseCampaignSchema.omit({isActive: true});

export const UpdateCampaignSchema = BaseCampaignSchema.extend({
  id: z.string().uuid({ message: "ID không hợp lệ" }),
});

export const UpdatePromotionCampaignSchema = z.object({
  promotionRuleIds: z.array(z.string().uuid()).optional(),
})

export const UpdateStoreCampaignSchema = z.object({
  storeIds: z.array(z.string().uuid()).optional(),
});

export type TCampaignResponse = z.infer<typeof CampaignResponseSchema>;
export type TCreateCampaignRequest = z.infer<typeof CreateCampaignSchema>;
export type TUpdateCampaignRequest = z.infer<typeof UpdateCampaignSchema>;
export type TUpdatePromotionCampaignRequest = z.infer<typeof UpdatePromotionCampaignSchema>;
export type TUpdateStoreCampaignRequest = z.infer<typeof UpdateStoreCampaignSchema>;

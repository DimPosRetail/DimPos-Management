import { z } from "zod";

const configSchema = z.object({
    VITE_API_CATALOG_URL: z.string(),
    VITE_API_IDENTITY_URL: z.string(),
    VITE_API_MENU_URL: z.string(),
    VITE_API_BRAND_URL: z.string(),
    VITE_API_STORE_URL: z.string(),
    VITE_API_PROMOTION_URL: z.string(),
    VITE_API_ORDER_URL: z.string(),
    VITE_API_PAYMENT_URL: z.string(),
    VITE_API_INVENTORY_URL: z.string(),
    VITE_API_NOTIFICATION_URL: z.string(),

    VITE_NOTIFICATION_HUB_URL: z.string(),
});

const configProject = configSchema.safeParse({
  VITE_API_CATALOG_URL: import.meta.env.VITE_API_CATALOG_URL,
  VITE_API_IDENTITY_URL: import.meta.env.VITE_API_IDENTITY_URL,
  VITE_API_MENU_URL: import.meta.env.VITE_API_MENU_URL,
  VITE_API_BRAND_URL: import.meta.env.VITE_API_BRAND_URL,
  VITE_API_STORE_URL: import.meta.env.VITE_API_STORE_URL,
  VITE_API_PROMOTION_URL: import.meta.env.VITE_API_PROMOTION_URL,
  VITE_API_ORDER_URL: import.meta.env.VITE_API_ORDER_URL,
  VITE_API_PAYMENT_URL: import.meta.env.VITE_API_PAYMENT_URL,
  VITE_API_INVENTORY_URL: import.meta.env.VITE_API_INVENTORY_URL,
  VITE_API_NOTIFICATION_URL: import.meta.env.VITE_API_NOTIFICATION_URL,

  VITE_NOTIFICATION_HUB_URL: import.meta.env.VITE_NOTIFICATION_HUB_URL,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;

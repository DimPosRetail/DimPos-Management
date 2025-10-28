import { z } from "zod";

export const StoreFinancialShiftConfigSchema = z.object({
  id: z.string(),
  openingTime: z.string().nonempty({ message: "Giờ mở ca không được để trống" }),
  closingTime: z.string().nonempty({ message: "Giờ đóng ca không được để trống" }),
  createdByAccountId: z.string(),
  isActive: z.boolean(),
  createdDate: z.date(),
  lastModifiedDate: z.date(),
});


export const CreateStoreFinancialShiftConfigSchema = z
  .object({
    openingTime: z
      .string()
      .nonempty({ message: "Vui lòng nhập giờ mở ca" }),
    closingTime: z
      .string()
      .nonempty({ message: "Vui lòng nhập giờ đóng ca" }),
  })
  .refine(
    (data) => {
      return data.openingTime < data.closingTime;
    },
    {
      message: "Giờ mở ca phải trước giờ đóng ca",
      path: ["closingTime"],
    }
  );


export const UpdateStoreFinancialShiftConfigSchema = z.object({
  openingTime: z
    .string()
    .nonempty({ message: "Giờ mở ca không được để trống" }),
  closingTime: z
    .string()
    .nonempty({ message: "Giờ đóng ca không được để trống" }),
  isActive: z.boolean({
    required_error: "Trạng thái hoạt động là bắt buộc",
  }),
});


export type TStoreFinancialShiftConfig = z.infer<typeof StoreFinancialShiftConfigSchema>;
export type TUpdateStoreFinancialShiftConfig = z.infer<typeof UpdateStoreFinancialShiftConfigSchema>;
export type TCreateStoreFinancialShiftConfig = z.infer<typeof CreateStoreFinancialShiftConfigSchema>;

const AccountSchema = z.object({
  id: z.string(),
  code: z.string(),
  username: z.string(),
  email: z.string(),
});

export const FinancialShiftSchema = z.object({
  id: z.string(),
  openingTimestamp: z.string().datetime(),
  openedByAccountId: z.string(),
  openingCashExpected: z.number(),
  openingCashActual: z.number(),
  openingDifferenceReason: z.string().nullable(),
  closingTimestamp: z.string().nullable(),
  closedByAccountId: z.string().nullable(),
  totalGrossSalesInShift: z.number().nullable(),
  totalNetSalesInShift: z.number().nullable(),
  totalTaxInShift: z.number().nullable(),
  totalDiscountInShift: z.number().nullable(),
  totalCashRoundingInShift: z.number().nullable(),
  status: z.number(),
  createdDate: z.string().datetime(),
  lastModifiedDate: z.string().datetime(),
  openedByAccount: AccountSchema.optional(),
  closedByAccount: AccountSchema.optional(),
});

export type TStoreFinancialShift = z.infer<typeof FinancialShiftSchema>;
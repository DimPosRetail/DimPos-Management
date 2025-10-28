import { StorePurchaseOrderStatusEnum } from "@/types/enums/store-purchase-order-status.enum";
import { z } from "zod";
import { StorePurchaseOrderItem, UpdateStorePurchaseOrderItem } from "./internal-purchase-order-items.schema";
import { ProductImageSchema } from "./product.schema";

export interface TGetPurchaseOrderQuery {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
  fromDate?: string | null;
  toDate?: string | null;

}
export const StoreInfoInOrder = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  description: z.string(),
  address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

export const AccountInfoInOrder = z.object({
  id: z.string().uuid(),
  code: z.string(),
  username: z.string(),
  email: z.string().optional(),
});

// MAIN ENTITY
export const StorePurchaseOrder = z.object({
  id: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  storeId: z.string().uuid({ message: "ID cửa hàng không hợp lệ" }),
  status: z.nativeEnum(StorePurchaseOrderStatusEnum),
  cancellationRequestReasonByStore: z.string().nullable().optional(),
  cancellationReasonByBrand: z.string().nullable().optional(),
  noteFromStore: z.string().nullable().optional(),
  noteFromBrand: z.string().nullable().optional(),
  estimatedTotalValue: z.number({ invalid_type_error: "Tổng giá trị phải là số" }).nullable().optional(),
  confirmedByBrandAt: z.date().nullable().optional(),
  cancelledAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  createdDate: z.date(),
  lastModifiedDate: z.date().nullable().optional(),
  storePurchaseOrderItems: z.array(StorePurchaseOrderItem).optional(),
  store: StoreInfoInOrder.optional(),
  createdByAccount: AccountInfoInOrder.optional(),
});

export const UpdateStorePurchaseOrder = z.object({
  cancellationRequestReasonByStore: z.string().nullable().optional(),
  cancellationReasonByBrand: z.string().nullable().optional(),
  status: z.nativeEnum(StorePurchaseOrderStatusEnum),
  storePurchaseOrderItemRequests: z.array(UpdateStorePurchaseOrderItem).optional(),
});

export type TStorePurchaseOrder = z.infer<typeof StorePurchaseOrder>;
export type TUpdateStorePurchaseOrder = z.infer<typeof UpdateStorePurchaseOrder>;

export function mapToUpdateStorePurchaseOrder(
  full: TStorePurchaseOrder
): TUpdateStorePurchaseOrder {
  return {
    cancellationRequestReasonByStore: full.cancellationRequestReasonByStore,
    cancellationReasonByBrand: full.cancellationReasonByBrand,
    status: full.status,
    storePurchaseOrderItemRequests: full.storePurchaseOrderItems?.map((item) => ({
      id: item.id,
      approvedQuantityByBrand: item.approvedQuantityByBrand,
    })) ?? [],
  };
}



export const InternalPurchaseOrderinStore = z.object({
  id: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
  storeId: z.string().uuid({ message: "ID cửa hàng không hợp lệ" }),
  status: z.nativeEnum(StorePurchaseOrderStatusEnum),
  cancellationRequestReasonByStore: z.string().nullable().optional(),
  cancellationReasonByBrand: z.string().nullable().optional(),
  noteFromStore: z.string().nullable().optional(),
  noteFromBrand: z.string().nullable().optional(),
  estimatedTotalValue: z.number({ invalid_type_error: "Tổng giá trị phải là số" }).nullable().optional(),
  confirmedByBrandAt: z.date().nullable().optional(),
  cancelledAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  createdByAccountId: z.string().uuid({ message: "ID tài khoản tạo đơn hàng không hợp lệ" }),
  createdDate: z.date(),
  lastModifiedDate: z.date().nullable().optional(),
  storePurchaseOrderItems: z.array(StorePurchaseOrderItem).optional(),
  store: StoreInfoInOrder.optional(),
});

export type TInternalPurchaseOrderinStore = z.infer<typeof InternalPurchaseOrderinStore>;

export const CreateStoreOrderItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  code: z.string().optional(),
  price: z.number().optional(),
  productImages: z.array(ProductImageSchema).optional(),
  productVariantId: z.string(),
  requestedQuantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

export const CreateInternalOrderRequestSchema = z.object({
  storePurchaseOrderItems: z.array(CreateStoreOrderItemSchema.pick({productVariantId:true, requestedQuantity: true})).min(1),
  note: z.string().optional(),
});

export const CreateInternalOrderSchema = z.object({
  storePurchaseOrderItems: z.array(CreateStoreOrderItemSchema).min(1),
  note: z.string().optional(),
});

export type TCreateInternalOrder = z.infer<typeof CreateInternalOrderSchema>;
export type TCreateInternalOrderRequest = z.infer<typeof CreateInternalOrderRequestSchema>;
export type TCreateStoreOrderItem = z.infer<typeof CreateStoreOrderItemSchema>;

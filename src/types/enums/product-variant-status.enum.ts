export const ProductVariantStatusEnum = {
  Active: 0,
  Inactive: 1,
  Discontinued: 2,
  Archived: 3,
} as const;

export type ProductVariantStatusEnum = typeof ProductVariantStatusEnum[keyof typeof ProductVariantStatusEnum];
export function getProductVariantStatusLabel(status: ProductVariantStatusEnum): string {
  switch (status) {
    case ProductVariantStatusEnum.Active:
      return 'Hoạt động';
    case ProductVariantStatusEnum.Inactive:
      return 'Không hoạt động';
    case ProductVariantStatusEnum.Discontinued:
      return 'Ngừng kinh doanh';
    case ProductVariantStatusEnum.Archived:
      return 'Lưu trữ';
    default:
      return 'Không xác định';
  }
}

export const CategoryTypeEnum = {
    Parent : 0,
    Child : 1,
} as const;
export type TCategoryTypeEnum = typeof CategoryTypeEnum[keyof typeof CategoryTypeEnum];

export function getCategoryTypeLabel(status: TCategoryTypeEnum): string {
  switch (status) {
    case CategoryTypeEnum.Parent:
      return 'Danh mục cha';
    case CategoryTypeEnum.Child:
      return 'Danh mục con';
    default:
      return 'Không xác định';
  }
}
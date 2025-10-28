export const CategoryStatusEnum = {
    Active : 0,
    Inactive : 1,
} as const;
export type TCategoryStatusEnum = typeof CategoryStatusEnum[keyof typeof CategoryStatusEnum];
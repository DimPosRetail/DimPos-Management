import { z } from "zod";

export const RoleSchema = z.enum([
    "SystemAdmin",
    "BrandAdmin",
    "StoreAdmin",
]);

export type TRole = z.infer<typeof RoleSchema>;
import { z } from "zod";

export const RuleActionsSchema = z.object({
    id: z.string().uuid(),
    actionType: z.number().int(),
    value: z.string().trim().min(1, { message: "Giá trị không được để trống" }),
    targetCriteriaForItemAction: z.string().nullable(),
    maxDiscountAmountForPercentage: z.number().nullable().optional(),
})

export const RuleConditionsSchema = z.object({
    id: z.string(),
    conditionType: z.number().int(),
    operator: z.number().int(),
    value: z.string().trim().min(1, { message: "Giá trị không được để trống" }),
})

export const CreateRuleConditionSchema = RuleConditionsSchema.omit({ id: true });
export const EditRuleConditionSchema = RuleConditionsSchema.omit({ id: true, conditionType: true });
export const CreateRuleActionSchema = RuleActionsSchema.omit({ id: true }).extend({
    targetCriteriaForItemAction: z.array(z.string().uuid()).nullable().optional(),
});
export const UpdateRuleActionSchema = CreateRuleActionSchema.omit({ actionType: true }).extend({
    actionType: z.number().int(),
});

export const EditRuleActionSchema = RuleActionsSchema.extend({
    targetCriteriaForItemAction: z.array(z.string().uuid()).nullable().optional(),
});


export const PromotionRuleBaseSchema = z.object({
    id: z.string().uuid(),
    name: z.string().trim().min(1, { message: "Tên không được để trống" }).max(100 , { message: "Tên không được quá 100 ký tự" }).transform(val => val.trim()),
    shortDescription: z.string().trim().min(1, { message: "Mô tả ngắn không được để trống" }).max(500, { message: "Mô tả ngắn không được quá 500 ký tự" }),
    description: z.string().optional(),
    isActive: z.boolean(),
    priority: z.number({message : "Ưu tiên không được bỏ trống"}).int({message: "Ưu tiên phải là số nguyên"}).min(1, { message: "Ưu tiên phải lớn hơn 0" }),
    ruleActions: RuleActionsSchema.optional(),
    ruleConditions: z.array(RuleConditionsSchema).optional(),
})

export const UpdatePromotionRuleSchema = PromotionRuleBaseSchema.omit({ruleActions: true, ruleConditions: true, id: true });

export const CreatePromotionRuleSchema = PromotionRuleBaseSchema.omit({ id: true, isActive: true }).extend({
    ruleActions: CreateRuleActionSchema.optional(),
    ruleConditions: z.array(CreateRuleConditionSchema).optional(),
})


export type TPromotionRuleResponse = z.infer<typeof PromotionRuleBaseSchema>;
export type TRuleActions = z.infer<typeof RuleActionsSchema>;
export type TRuleConditions = z.infer<typeof RuleConditionsSchema>;
export type TUpdatePromotionRule = z.infer<typeof UpdatePromotionRuleSchema>;
export type TCreatePromotionRuleRequest = z.infer<typeof CreatePromotionRuleSchema>;
export type TCreateRuleCondition = z.infer<typeof CreateRuleConditionSchema>;
export type TCreateRuleAction = z.infer<typeof CreateRuleActionSchema>;
export type TUpdateRuleAction = z.infer<typeof UpdateRuleActionSchema>;
export type TEditRuleAction = z.infer<typeof EditRuleActionSchema>;
export type TEditRuleCondition = z.infer<typeof EditRuleConditionSchema>;


export const getActionTypeName = (actionType: number | undefined): string => {
    if (actionType === undefined) return "N/A";

    switch (actionType) {
        case 0: return "Khuyến mãi theo phần trăm toàn giỏ hàng";
        case 1: return "Khuyến mãi cố định toàn giỏ hàng";
        case 2: return "Khuyến mãi theo phần trăm cho từng sản phẩm";
        case 3: return "Khuyến mãi theo phần trăm cho một sản phẩm";
        case 4: return "Khuyến mãi cố định cho từng sản phẩm";
        case 5: return "Khuyến mãi cố định cho một sản phẩm";
        case 6: return "Tặng sản phẩm";
        default: return "Không xác định";
    }
};

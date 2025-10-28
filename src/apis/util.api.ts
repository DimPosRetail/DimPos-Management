export const normalizeParams = (filters: any) => {
  const normalized = { ...filters };
  const sort = filters.sort?.split(",");

  if (Array.isArray(sort) && sort.length) {
    normalized.sortBy = sort[0];
    normalized.sortDirection = sort[1];
  }

  const removeEmptyValueParams = Object.fromEntries(
    Object.entries(normalized).filter(([_, v]) => v != null)
  );
  return removeEmptyValueParams;
};


export const API_SUFFIX = {
  // Auth
  AUTH_API: "/authentication/login",

  // Store
  STORE_API: "/stores",
  STORE_DETAIL_API: "/stores/detail",
  STORE_MENU_API: "/store-menus",
  STORE_MENU_ITEM_API: "/store-menu-items",
  STORE_PRODUCT_PRICE_API: "/store-prices",
  STORE_PAYMENT_METHOD_CONFIG_API: "/store-payment-method-configs",
  STORE_FINANCIAL_SHIFT_CONFIG_API: "/financial-shift-configs",
  STORE_FINANCIAL_SHIFT_API: "/financial-shifts",

  // Product
  CATEGORY_API: "/categories",
  PRODUCT_API: "/products",
  PRODUCT_VARIANT_API: "/product-variants",
  INTERNAL_PRODUCT_API: "/internal-products",
  COMBO_PRODUCT_API: "/combo-products",
  COMBO_PRODUCT_ITEM_API : "/product-combo-items",
  EXTRA_PRODUCT_API: "/extra-products",

  // Modifier
  MODIFIER_GROUP_API: "/modifier-groups",
  MODIFIER_OPTION_API: "/modifier-options",

  // Ingredient
  INGREDIENT_API: "/ingredients",

  // Inventory
  INVENTORY_API: "/inventory-stocks",

  // Promotion / Campaign
  CAMPAIGN_API: "/campaigns",
  PROMOTION_RULE_API: "/promotion-rules",

  // Order
  ORDER_API: "/orders",
  INTERNAL_PURCHASE_ORDER_API: "/store-purchase-orders",

  // Staff
  STAFF_API: "/staffs",

  // Brand
  BRAND_API: {
    BRAND: "/brands",
    BRAND_DETAIL: "/brands/detail",
  },
  BRAND_MENU_API: "/brand-menus",
  SYSTEM_PAYMENT_METHOD_API: "/system-payment-methods",

  // Notification
  NOTIFICATION_API: "/notifications",

  // Dashboard
  DASHBOARD_API: "/dashboards",
};

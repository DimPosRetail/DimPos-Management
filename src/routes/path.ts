
const path = (root: string, sublink: string) => {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_BRAND_DASHBOARD = '/brand-admin/dashboard';
const ROOTS_ADMIN_DASHBOARD = '/system-admin/dashboard';
const ROOTS_STORE_DASHBOARD = '/store-admin/dashboard';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  logout: path(ROOTS_AUTH, '/logout'),
};

export const PATH_BRAND_DASHBOARD = {
  root: ROOTS_BRAND_DASHBOARD,
  general: {
    app: path(ROOTS_BRAND_DASHBOARD, '/app'),
  },
  category: {
    root: path(ROOTS_BRAND_DASHBOARD, '/category'),
    create: path(ROOTS_BRAND_DASHBOARD, '/category/new'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/category/${id}`),
  },
  product: {
    //Product
    root: path(ROOTS_BRAND_DASHBOARD, '/product'),
    createProduct: path(ROOTS_BRAND_DASHBOARD, '/product/new'),
    editProduct: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/product/${id}`),

    //Product variant
    variant: path(ROOTS_BRAND_DASHBOARD, '/product-variant'),
    createVariant: path(ROOTS_BRAND_DASHBOARD, '/product-variant/new'),
    editVariant: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/product-variant/${id}`),

    //Modifier
    modifier: path(ROOTS_BRAND_DASHBOARD, '/modifier-group'),
    createModifier: path(ROOTS_BRAND_DASHBOARD, '/modifier-group/new'),
    editModifier: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/modifier-group/${id}`),
    menu: path(ROOTS_BRAND_DASHBOARD, '/menu'),
    createMenu: path(ROOTS_BRAND_DASHBOARD, '/menu/new'),
    editMenu: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/menu/${id}`),
    discount: path(ROOTS_BRAND_DASHBOARD, '/discount'),
    importProduct: path(ROOTS_BRAND_DASHBOARD, '/import-product'),
  },
  combo: {
    root: path(ROOTS_BRAND_DASHBOARD, '/product-combos'),
    create: path(ROOTS_BRAND_DASHBOARD, '/product-combos/new'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/product-combos/${id}`),
  },

  extra: {
    root: path(ROOTS_BRAND_DASHBOARD, '/product-extra'),
    create: path(ROOTS_BRAND_DASHBOARD, '/product-extra/new'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/product-extra/${id}`),
  },

  ingredient: {
    root: path(ROOTS_BRAND_DASHBOARD, '/ingredient'),
    create: path(ROOTS_BRAND_DASHBOARD, '/ingredient/new'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/ingredient/${id}`),
  },
  tax: {
    root: path(ROOTS_BRAND_DASHBOARD, '/tax'),
  },

  recipe: {
    root: path(ROOTS_BRAND_DASHBOARD, '/recipe'),
  },
  internalPurchaseOrders: {
    root: path(ROOTS_BRAND_DASHBOARD, '/brand-purchase-orders'),
    create: path(ROOTS_BRAND_DASHBOARD, '/brand-purchase-orders/create'),
    detail: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/brand-purchase-orders/${id}`),
  },
  promotion: {
    root: path(ROOTS_BRAND_DASHBOARD, '/promotion'),
    create: path(ROOTS_BRAND_DASHBOARD, '/promotion/new'),
    editPromotion: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/promotion/${id}`),
  },
  campaign: {
    root: path(ROOTS_BRAND_DASHBOARD, '/campaign'),
    createCampaign: path(ROOTS_BRAND_DASHBOARD, '/campaign/new'),
    editCampaign: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/campaign/${id}`),
  },
  purchasableProduct: {
    root: path(ROOTS_BRAND_DASHBOARD, '/purchase-products'),
    create: path(ROOTS_BRAND_DASHBOARD, '/purchase-products/new'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/purchase-products/${id}`),
  },
  accountStore: {
    root: path(ROOTS_BRAND_DASHBOARD, '/store-account'),
  },

  order: {
    root: path(ROOTS_BRAND_DASHBOARD, '/brand-order'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/brand-order/${id}`),
  },

  brand: {
    root: path(ROOTS_BRAND_DASHBOARD, '/brand'),
  },
  store: {
    root: path(ROOTS_BRAND_DASHBOARD, '/store'),
    create: path(ROOTS_BRAND_DASHBOARD, '/store/new'),
    edit: (id: string) => path(ROOTS_BRAND_DASHBOARD, `/store/${id}`),
  },
  role: {
    root: path(ROOTS_BRAND_DASHBOARD, '/role'),
  },
  invoice: {
    root: path(ROOTS_BRAND_DASHBOARD, '/invoice'),
  }
}


export const PATH_ADMIN_DASHBOARD = {
  root: ROOTS_ADMIN_DASHBOARD,

  general: {
    app: path(ROOTS_ADMIN_DASHBOARD, "/app"),
  },

  brand: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/brand"),
    create: path(ROOTS_ADMIN_DASHBOARD, "/brand/new"),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/brand/${id}`),
  },

  brandAccount: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/brand-account"),
    create: path(ROOTS_ADMIN_DASHBOARD, "/brand-account/new"),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/brand-account/${id}`),
  },

  systemPaymentMethod: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/payment-method"),
    edit:(id: string)=> path(ROOTS_ADMIN_DASHBOARD, `/payment-method/${id}`),
    create: path(ROOTS_ADMIN_DASHBOARD, "/payment-method/create"),
  },
  systemLog: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/system-log"),
  },
};

export const PATH_STORE_DASHBOARD = {
  root: ROOTS_STORE_DASHBOARD,

  general: {
    app: path(ROOTS_STORE_DASHBOARD, '/app'),
  },

  dashboard: {
    root: path(ROOTS_STORE_DASHBOARD, '/app'),
    metrics: path(ROOTS_STORE_DASHBOARD, '/dashboard/metrics'),
    charts: path(ROOTS_STORE_DASHBOARD, '/dashboard/charts'),
  },

  menu: {
    root: path(ROOTS_STORE_DASHBOARD, '/menu'),
    detail: (id: string) => path(ROOTS_STORE_DASHBOARD, `/menu/${id}`),
  },

  campaignPromotion: {
    root: path(ROOTS_STORE_DASHBOARD, '/campaign-promotion'),
    detail: (id: string) => path(ROOTS_STORE_DASHBOARD, `/campaign-promotion/${id}`),
  },

  order: {
    root: path(ROOTS_STORE_DASHBOARD, '/orders'),
    detail: (id: string) => path(ROOTS_STORE_DASHBOARD, `/orders/${id}`),
  },

  purchaseRequest: {
    root: path(ROOTS_STORE_DASHBOARD, '/purchase-requests'),
    detail: (id: string) => path(ROOTS_STORE_DASHBOARD, `/purchase-requests/${id}`),
    create: () => path(ROOTS_STORE_DASHBOARD, `/purchase-requests/create`),

  },

  financialShift: {
    root: path(ROOTS_STORE_DASHBOARD, '/financial-shifts'),
    detail: (id: string) => path(ROOTS_STORE_DASHBOARD, `/financial-shifts/${id}`),

  },

  inventory: {
    root: path(ROOTS_STORE_DASHBOARD, '/inventory'),
    edit: (id: string) => path(ROOTS_STORE_DASHBOARD, `/inventory/${id}`),
  },

  storeSettings: {
    root: path(ROOTS_STORE_DASHBOARD, '/settings'),
  },
};
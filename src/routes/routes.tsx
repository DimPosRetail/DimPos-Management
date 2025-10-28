// routes.tsx
import LoadingScreen from "@/components/loading-screen";
import AuthGuard from "@/guards/auth-guard";
import RoleBasedGuard from "@/guards/role-based-guard";
import DashBoardLayout from "@/layouts/dashboard/dash-board-layout";
import Logout from "@/pages/auth/logout/logout";
import { lazy, Suspense, type ElementType } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import GuestGuard from "../guards/guest-guard";
import
{
  PATH_ADMIN_DASHBOARD,
  PATH_AUTH,
  PATH_BRAND_DASHBOARD,
  PATH_STORE_DASHBOARD,
} from "./path";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-fallback";



const Loadable = ( Component: ElementType ) => ( props: any ) =>
{
  return (
    <QueryErrorResetBoundary>
      { ( { reset } ) => (
        <ErrorBoundary onReset={ reset } FallbackComponent={ ErrorFallback }>
          <Suspense fallback={ <LoadingScreen /> }>
            <Component { ...props } />
          </Suspense>
        </ErrorBoundary>
      ) }
    </QueryErrorResetBoundary>
  );
};
//
const LoginPage = Loadable( lazy( () => import( "@/pages/auth/login" ) ) );

const GeneralAppPage = Loadable( lazy( () => import( "@/pages/general-app" ) ) );
// const GeneralEcommercePage = Loadable(
//   lazy( () => import( "@/pages/general-ecommerce" ) )
// );


//System admin
const SystemPaymentMethodPage = Loadable(
  lazy( () => import( "@/pages/system-admin/system-payment-method/list-system-payment-method" ) )
);
const DetailSystemPaymentMethodPage = Loadable(
  lazy( () => import( "@/pages/system-admin/system-payment-method/edit-system-payment-method/edit-system-payment-method-page" ) )
);
const SystemLogPage = Loadable( lazy( () => import( "@/pages/system-admin/system-log" ) ) );
const BrandManagementPage = Loadable(
  lazy( () => import( "@/pages/system-admin/brand-management/list" ) )
);
const CreateBrandPage = Loadable(
  lazy( () => import( "@/pages/system-admin/brand-management/create" ) )
);
const EditBrandPage = Loadable(
  lazy( () => import( "@/pages/system-admin/brand-management/edit" ) )
);

//Brand admin
const BrandAccountPage = Loadable( lazy( () => import( "@/pages/system-admin/brand-account" ) ) );
const BrandOrderEditPage = Loadable( lazy( () => import( "@/pages/brand-admin/brand-order/edit-order" ) ) );
const OrderPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/brand-order/list-order" ) )
);
// Product routes
const CategoryPage = Loadable( lazy( () => import( "@/pages/brand-admin/category/list" ) ) );
const CategoryCreatePage = Loadable(
  lazy( () => import( "@/pages/brand-admin/category/create" ) )
);
const CategoryEditPage = Loadable( lazy( () => import( "@/pages/brand-admin/category/edit" ) ) );
const ProductPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/product/list-product" ) )
);
const ProductCreatePage = Loadable(
  lazy( () => import( "@/pages/brand-admin/product/create-product" ) )
);
const ProductEditPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/product/edit-product" ) )
);
const ProductVariantPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/product-variant/list-product-variant" ) )
);
const ProductVariantEditPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/product-variant/edit-product-variant" ) )
);
const ModifierGroupPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/modifier-group/list-modifier-group" ) )
);
const ModifierGroupCreatePage = Loadable(
  lazy( () => import( "@/pages/brand-admin/modifier-group/create-modifier-group" ) )
);

const ModifierGroupEditPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/modifier-group/edit-modifier-group" ) )
);


const IngredientPage = Loadable( lazy( () => import( "@/pages/brand-admin/ingredient/list-ingredient" ) ) );
const IngredientCreatePage = Loadable( lazy( () => import( "@/pages/brand-admin/ingredient/create-ingredient" ) ) );
const IngredientEditPage = Loadable( lazy( () => import( "@/pages/brand-admin/ingredient/edit-ingredient" ) ) );
const PurchasableProductListPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/purchasable-product/list-purchasable-product" ) )
);
const PurchasableProductCreatePage = Loadable(
  lazy( () => import( "@/pages/brand-admin/purchasable-product/create-purchasable-product" ) )
);
const PurchasableProductEditPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/purchasable-product/edit-purchasable-product" ) )
);

const InternalPurchaseOrderPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/brand-purchase-orders/list" ) )
);

const InternalPurchaseOrderEditPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/brand-purchase-orders/edit" ) )
);

// Menu routes
const MenuPage = Loadable( lazy( () => import( "@/pages/brand-admin/menu/list-menu" ) ) );
const MenuCreatePage = Loadable( lazy( () => import( "@/pages/brand-admin/menu/create-menu" ) ) );
const MenuEditPage = Loadable( lazy( () => import( "@/pages/brand-admin/menu/edit-menu" ) ) );

const PromotionPage = Loadable( lazy( () => import( "@/pages/brand-admin/promotion/list" ) ) );
const CreatePromotionPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/promotion/create-promotion" ) )
);
const EditPromotionPage = Loadable(
  lazy( () => import( "@/pages/brand-admin/promotion/edit-promotion" ) )
);
// const CampaignPage = Loadable(lazy(() => import("@/pages/campaign")));

const ProductComboListPage = Loadable( lazy( () => import( "@/pages/brand-admin/product-combo/list" ) ) );
const CreateComboProductPage = Loadable( lazy( () => import( "@/pages/brand-admin/product-combo/create" ) ) );
const EditComboProductPage = Loadable( lazy( () => import( "@/pages/brand-admin/product-combo/edit" ) ) );

const ProductExtraListPage = Loadable( lazy( () => import( "@/pages/brand-admin/product-extra/list" ) ) );
const CreateProductExtraPage = Loadable( lazy( () => import( "@/pages/brand-admin/product-extra/create" ) ) );
const EditProductExtraPage = Loadable( lazy( () => import( "@/pages/brand-admin/product-extra/edit" ) ) );

const BrandPage = Loadable( lazy( () => import( "@/pages/brand-admin/brand" ) ) );
// const InvoicePage = Loadable( lazy( () => import( "@/pages/invoice" ) ) );

const CampaignPage = Loadable( lazy( () => import( "@/pages/brand-admin/campaign/list" ) ) );
const CampaignCreatePage = Loadable( lazy( () => import( "@/pages/brand-admin/campaign/create" ) ) );
const CampaignEditPage = Loadable( lazy( () => import( "@/pages/brand-admin/campaign/edit" ) ) );
const StorePage = Loadable( lazy( () => import( "@/pages/brand-admin/store/list-stores" ) ) );
const StoreEditPage = Loadable( lazy( () => import( "@/pages/brand-admin/store/edit-store" ) ) );
const StoreCreatePage = Loadable(
  lazy( () => import( "@/pages/brand-admin/store/create-store" ) )
);

//Store management
const OrderListPage = Loadable( lazy( () => import( "@/pages/store-admin/order-store/order-list-page" ) ) );
const InternalPurchaseOrdersbyStorePage = Loadable( lazy( () => import( "@/pages/store-admin/purchase-orders-store/list" ) ) );
// const CreateInternalPurchaseOrdersbyStorePage = Loadable( lazy( () => import( "@/pages/store-admin/purchase-orders-store/create" ) ) );
const StorePurchasePage = Loadable( lazy( () => import( "@/pages/store-admin/purchase-orders-store/edit" ) ) );
const StoreOrderDetailPage = Loadable( lazy( () => import( "@/pages/store-admin/order-store/order-detail-store" ) ) );
const StoreOverviewPage = Loadable( lazy( () => import( "@/pages/store-admin/store-setting" ) ) );
const FinancialShiftPage = Loadable( lazy( () => import( "@/pages/store-admin/store-financial-shift/list" ) ) );
const FinancialShiftDetailPage = Loadable( lazy( () => import( "@/pages/store-admin/store-financial-shift/detail" ) ) );
const InventoryReportPage = Loadable(
  lazy( () => import( "@/pages/store-admin/inventory-report/list-inventory-stock" ) )
);
const EditInventoryStockPage = Loadable(
  lazy( () => import( "@/pages/store-admin/inventory-report/edit-inventory-stock" ) )
);
const StoreCampaignPromotionPage = Loadable( lazy( () => import( "@/pages/store-admin/campaign-promotion/list" ) ) );
const StoreCampaignPromotionDetailPage = Loadable( lazy( () => import( "@/pages/store-admin/campaign-promotion/detail" ) ) );
const StoreMenuPage = Loadable( lazy( () => import( "@/pages/store-admin/store-menu/list" ) ) );
const DetailStoreMenuPage = Loadable( lazy( () => import( "@/pages/store-admin/store-menu/detail" ) ) );



const Page404 = Loadable( lazy( () => import( "@/pages/page-404" ) ) );


export const AppRoutes = () =>
  useRoutes( [
    {
      path: PATH_AUTH.root,
      children: [
        {
          element: <Navigate to={ PATH_AUTH.login } replace />,
          index: true,
        },
        {
          path: "login",
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    // Brand Admin Dashboard routes
    {
      path: PATH_BRAND_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="BrandAdmin">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={ PATH_BRAND_DASHBOARD.general.app } replace />,
          index: true,
        },
        {
          path: "app",
          element: <GeneralAppPage />,
        },
        // {
        //   path: "ecommerce",
        //   element: <GeneralEcommercePage />,
        // },

        {
          path: "category",
          element: <CategoryPage />,
        },
        {
          path: "category/new",
          element: <CategoryCreatePage />,
        },

        // Product routes
        {
          path: "product",
          element: <ProductPage />,
        },
        {
          path: "product/new",
          element: <ProductCreatePage />,
        },
        {
          path: "category/:id",
          element: <CategoryEditPage />,
        },
        {
          path: "product/:id",
          element: <ProductEditPage />,
        },
        {
          path: "product-variant",
          element: <ProductVariantPage />,
        },
        {
          path: "product-variant/:id",
          element: <ProductVariantEditPage />,
        },
        {
          path: "modifier-group",
          element: <ModifierGroupPage />,
        },
        {
          path: "modifier-group/new",
          element: <ModifierGroupCreatePage />,
        },
        {
          path: "modifier-group/:id",
          element: <ModifierGroupEditPage />,
        },
        {
          path: "ingredient",
          element: <IngredientPage />,
        },
        {
          path: "ingredient/new",
          element: <IngredientCreatePage />,
        },
        {
          path: "ingredient/:id",
          element: <IngredientEditPage />,
        },
        // Promotion routes
        {
          path: "promotion",
          element: <PromotionPage />,
        },
        {
          path: "promotion/new",
          element: <CreatePromotionPage />,
        },
        {
          path: "promotion/:id",
          element: <EditPromotionPage />,
        },

        {
          path: "campaign",
          element: <CampaignPage />,
        },
        {
          path: "campaign/new",
          element: <CampaignCreatePage />,
        },
        {
          path: "campaign/:id",
          element: <CampaignEditPage />,
        },
        // Menu routes
        {
          path: "menu",
          element: <MenuPage />,
        },
        {
          path: "menu/new",
          element: <MenuCreatePage />,
        },
        {
          path: "menu/:id",
          element: <MenuEditPage />,
        },
        {
          path: "brand",
          element: <BrandPage />,
        },
        {
          path: "store",
          element: <StorePage />,
        },
        {
          path: "store/:id",
          element: <StoreEditPage />,
        },
        {
          path: "store/new",
          element: <StoreCreatePage />,
        },
        // {
        //   path: "invoice",
        //   element: <InvoicePage />,
        // },
        {
          path: "brand-order",
          element: <OrderPage />,
        },
        {
          path: "brand-order/:id",
          element: <BrandOrderEditPage />,
        },
        {
          path: "brand-purchase-orders",
          element: <InternalPurchaseOrderPage />,
        },
        {
          path: "brand-purchase-orders/:id",
          element: <InternalPurchaseOrderEditPage />,
        },
        {
          path: "purchase-products",
          element: <PurchasableProductListPage />,
        },
        {
          path: "purchase-products/new",
          element: <PurchasableProductCreatePage />,
        },
        {
          path: "purchase-products/:id",
          element: <PurchasableProductEditPage />,
        },
        {
          path: "product-combos",
          element: <ProductComboListPage />,
        },
        {
          path: "product-combos/new",
          element: <CreateComboProductPage />,
        },
        {
          path: "product-combos/:id",
          element: <EditComboProductPage />,
        },
        {
          path: "product-extra",
          element: <ProductExtraListPage />,
        },
        {
          path: "product-extra/new",
          element: <CreateProductExtraPage />,
        },
        {
          path: "product-extra/:id",
          element: <EditProductExtraPage />,
        }
      ],
    },
    // System Admin Dashboard routes
    {
      path: PATH_ADMIN_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="SystemAdmin">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={ PATH_ADMIN_DASHBOARD.general.app } replace />,
          index: true,
        },
        {
          path: "app",
          element: <GeneralAppPage />,
        },
        {
          path: "brand",
          element: <BrandManagementPage />,
        },
        {
          path: "brand/new",
          element: <CreateBrandPage />,
        },
        {
          path: "brand/:id",
          element: <EditBrandPage />,
        },
        {
          path: "brand-account",
          element: <BrandAccountPage />,
        },
        {
          path: "brand/account/new",
          element: <BrandAccountPage />,
        },
        {
          path: "payment-method",
          element: <SystemPaymentMethodPage />,
        },
        {
          path: "payment-method/:id",
          element: <DetailSystemPaymentMethodPage />,
        },
        {
          path: "system-log",
          element: <SystemLogPage />,
        },
        // {
        //   path: "brand/account/:id",
        //   element: < />,
        // },
      ],
    },
    // Store Admin Dashboard routes
    {
      path: PATH_STORE_DASHBOARD.root,
      element: (
        <RoleBasedGuard role="StoreAdmin">
          <DashBoardLayout />
        </RoleBasedGuard>
      ),

      children: [
        {
          element: <Navigate to={ PATH_STORE_DASHBOARD.general.app } replace />,
          index: true,
        },

        // Dashboard
        { path: "app", element: <GeneralAppPage /> },
        { path: "dashboard/metrics", element: <GeneralAppPage /> },
        { path: "dashboard/charts", element: <GeneralAppPage /> },

        // Menu
        { path: "menu", element: <StoreMenuPage /> },
        { path: "menu/:id", element: <DetailStoreMenuPage /> },

        // Promotion
        { path: "campaign-promotion", element: <StoreCampaignPromotionPage /> },
        { path: "campaign-promotion/:id", element: <StoreCampaignPromotionDetailPage /> },

        // Orders
        { path: 'orders', element: <OrderListPage /> },
        { path: 'orders/:id', element: <StoreOrderDetailPage /> },

        // Internal Purchase Requests
        { path: "purchase-requests", element: <InternalPurchaseOrdersbyStorePage /> },
        { path: "purchase-requests/:id", element: <StorePurchasePage /> },
        // { path: "purchase-requests/create", element: <CreateInternalPurchaseOrdersbyStorePage /> },
        // Financial Shifts
        { path: "financial-shifts", element: <FinancialShiftPage /> },
        { path: "financial-shifts/:id", element: <FinancialShiftDetailPage /> },
        // Inventory
        { path: "inventory", element: <InventoryReportPage /> },
        { path: "inventory/:id", element: <EditInventoryStockPage /> },

        // Settings
        { path: "settings", element: <StoreOverviewPage /> },
      ],
    },
    {
      path: "/",
      element: (
        <AuthGuard>
          <DashBoardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <Navigate to={ PATH_BRAND_DASHBOARD.root } replace />,
          index: true,
        },
      ],
    },
    // Add the 404 route
    {
      path: "/404",
      element: <Page404 />,
    },
    // Catch all unmatched routes
    { path: "*", element: <Navigate to="/404" replace /> },
  ] );

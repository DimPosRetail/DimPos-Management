import * as React from "react";

import BoxAddIcon from "@/assets/icons/box-add-icon";
import CollapseIcon from "@/assets/icons/collapse-icon";
import GeneralAppIcon from "@/assets/icons/general-app-icon";
import HomeIcon from "@/assets/icons/home-icon";
// import InventoryReportIcon from "@/assets/icons/inventory-report-icon"
import CampaignIcon from "@/assets/icons/campaign-icon";
import DiscountIcon from "@/assets/icons/discount-icon";
import DocumentFilterIcon from "@/assets/icons/document-filter-icon";
import ExtraProductIcon from "@/assets/icons/extra-product-icon";
import IngredientIcon from "@/assets/icons/ingredient-icon";
import MenuIcon from "@/assets/icons/menu-icon";
import NoteIcon from "@/assets/icons/note-icon";
import OrderIcon from "@/assets/icons/order-icon";
import ProductComboIcon from "@/assets/icons/product-combo-icon";
import ProductIcon from "@/assets/icons/product-icon";
import ProductVariantIcon from "@/assets/icons/product-variant-icon";
import PurchaseProductIcon from "@/assets/icons/purchase-product-icon";
import ReceiptIcon from "@/assets/icons/receipt-icon";
import ShopIcon from "@/assets/icons/shop-icon";
import StoreListIcon from "@/assets/icons/store-list-icon";
import { NavMain } from "@/components/nav-main";
import
{
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBrand } from "@/hooks/use-brand";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import
{
  PATH_ADMIN_DASHBOARD,
  PATH_BRAND_DASHBOARD,
  PATH_STORE_DASHBOARD,
} from "@/routes/path";
import type { TRole } from "@/schema/role.schema";
import { useSelector } from "react-redux";

// This is sample data.
const brandRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Tổng Quan",
        url: PATH_BRAND_DASHBOARD.general.app,
        icon: GeneralAppIcon,
      },
      // {
      //   title: "Báo cáo Kho",
      //   url: PATH_BRAND_DASHBOARD.general.inventoryReport,
      //   icon: InventoryReportIcon,
      // }
    ],
  },
  productManagement: {
    mainTitle: "Quản lý sản phẩm & danh mục",
    items: [
      {
        title: "Danh mục",
        url: PATH_BRAND_DASHBOARD.category.root,
        icon: MenuIcon,
      },
      {
        title: "Sản phẩm",
        url: PATH_BRAND_DASHBOARD.product.root,
        icon: ProductIcon,
      },
      {
        title: "Biến thể sản phẩm",
        url: PATH_BRAND_DASHBOARD.product.variant,
        icon: ProductVariantIcon,
      },
      {
        title: "Combo sản phẩm",
        url: PATH_BRAND_DASHBOARD.combo.root,
        icon: ProductComboIcon,
      },
      {
        title: "Tùy chọn sản phẩm",
        url: PATH_BRAND_DASHBOARD.product.modifier,
        icon: DocumentFilterIcon,
      },
      {
        title: "Sản phẩm phụ",
        url: PATH_BRAND_DASHBOARD.extra.root,
        icon: ExtraProductIcon,
      },
      {
        title: "Thực đơn",
        url: PATH_BRAND_DASHBOARD.product.menu,
        icon: NoteIcon,
      },
      {
        title: "Thành phần",
        url: PATH_BRAND_DASHBOARD.ingredient.root,
        icon: IngredientIcon
      }
    ],
  },
  taxManagement: {
    mainTitle: "Thuế",
    items: [
      {
        title: "Thuế",
        url: PATH_BRAND_DASHBOARD.tax.root,
        icon: GeneralAppIcon,
      },
    ],
  },
  promotionCampaignManagement: {
    mainTitle: "Khuyến mãi & chiến dịch",
    items: [
      {
        title: "Khuyến mãi",
        url: PATH_BRAND_DASHBOARD.promotion.root,
        icon: DiscountIcon,
      },
      {
        title: "Chiến dịch",
        url: PATH_BRAND_DASHBOARD.campaign.root,
        icon: CampaignIcon,
      },
    ],
  },
  storeManagement: {
    mainTitle: "Quản lý cửa hàng",
    items: [
      {
        title: "Danh sách cửa hàng",
        url: PATH_BRAND_DASHBOARD.store.root,
        icon: StoreListIcon,
      },
      {
        title: "Đơn hàng",
        url: PATH_BRAND_DASHBOARD.order.root,
        icon: OrderIcon,
      },
      {
        title: "Sản phẩm nhập hàng",
        url: PATH_BRAND_DASHBOARD.purchasableProduct.root,
        icon: PurchaseProductIcon,
      },
      {
        title: "Đơn nhập hàng",
        url: PATH_BRAND_DASHBOARD.internalPurchaseOrders.root,
        icon: BoxAddIcon,
      },
    ],
  },
  generalManagement: {
    mainTitle: "Quản lý chung",
    items: [
      {
        title: "Về thương hiệu",
        url: PATH_BRAND_DASHBOARD.brand.root,
        icon: HomeIcon,
      },
      // {
      //   title: "Quản lý Hóa đơn",
      //   url: PATH_BRAND_DASHBOARD.invoice.root,
      //   icon: ReceiptIcon,
      // },
    ],
  },
};

const adminRoutes = {
  dashboard: {
    mainTitle: "Dashboard",
    items: [
      {
        title: "Nhật ký hệ thống",
        url: PATH_ADMIN_DASHBOARD.systemLog.root,
        icon: HomeIcon,
      },
    ],
  },
  brand: {
    mainTitle: "Quản lý thương hiệu",
    items: [
      {
        title: "Danh sách thương hiệu",
        url: PATH_ADMIN_DASHBOARD.brand.root,
        icon: HomeIcon,
      },
    ],
  },
  systemManagement: {
    mainTitle: "Quản lý hệ thống",
    items: [
      {
        title: "Phương thức thanh toán",
        url: PATH_ADMIN_DASHBOARD.systemPaymentMethod.root,
        icon: GeneralAppIcon,
      },
    ],
  },
};

const storeRoutes = {
  dashboard: {
    mainTitle: "Tổng quan hoạt động",
    items: [
      {
        title: "Báo Cáo Tổng Quan",
        url: PATH_STORE_DASHBOARD.dashboard.root,
        icon: GeneralAppIcon,
      },
      // {
      //   title: "Chỉ số kinh doanh",
      //   url: PATH_STORE_DASHBOARD.dashboard.metrics,
      //   icon: InventoryReportIcon,
      // },
      // {
      //   title: "Biểu đồ & Thống kê",
      //   url: PATH_STORE_DASHBOARD.dashboard.charts,
      //   icon: ReceiptIcon,
      // },
    ],
  },
  sales: {
    mainTitle: "Bán hàng & khuyến mãi",
    items: [

      {
        title: "Đơn hàng",
        url: PATH_STORE_DASHBOARD.order.root,
        icon: ReceiptIcon,
      },
      {
        title: "Ca tài chính",
        url: PATH_STORE_DASHBOARD.financialShift.root,
        icon: NoteIcon,
      },
      {
        title: "Chiến dịch khuyến mãi",
        url: PATH_STORE_DASHBOARD.campaignPromotion.root,
        icon: DiscountIcon,
      },
    ],
  },
  operation: {
    mainTitle: "Quản lí cửa hàng & sản phẩm",
    items: [
      {
        title: "Thực đơn",
        url: PATH_STORE_DASHBOARD.menu.root,
        icon: MenuIcon,
      },
      {
        title: "Yêu cầu nhập hàng",
        url: PATH_STORE_DASHBOARD.purchaseRequest.root,
        icon: BoxAddIcon,
      },
      {
        title: "Tồn kho sản phẩm",
        url: PATH_STORE_DASHBOARD.inventory.root,
        icon: ProductIcon,
      },
    ],
  },
  settings: {
    mainTitle: "Cấu hình",
    items: [
      {
        title: "Cấu hình chung",
        url: PATH_STORE_DASHBOARD.storeSettings.root,
        icon: ShopIcon,
      },
    ],
  },
};

export function AppSidebar ( { ...props }: React.ComponentProps<typeof Sidebar> )
{
  const { getBrandDetails } = useBrand();
  const { getBrandLogoImageFromStore } = useStore();
  const { role } = useSelector( ( state: RootState ) => state.user );
  const { data: brandData } = getBrandDetails( role as TRole );
  const { data: storeLogoImage } = getBrandLogoImageFromStore( role as TRole );
  const { toggleSidebar, open } = useSidebar();
  return (
    <Sidebar variant="sidebar" collapsible="icon" { ...props }>
      <SidebarHeader>
        <div className="flex items-center justify-between my-0">
          <div
            className="cursor-pointer"
            onClick={ open ? undefined : toggleSidebar }
          >
            <img
              className={ cn( open ? "size-15" : "size-8", "duration-300" ) }
              src={ brandData?.data.data.pictureUrl || storeLogoImage || "https://s3-hcm5-r1.longvan.net/19429498-dimpos/0a8eae54-e987-4205-9fb8-c0e3b5266f9f.jpg" }
              alt="Ảnh đại diện"
            />
          </div>
          { open && (
            <div className="cursor-pointer" onClick={ toggleSidebar }>
              <CollapseIcon className="size-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" />
            </div>
          ) }
        </div>
      </SidebarHeader>
      { ( () =>
      {
        switch ( role )
        {
          case "BrandAdmin":
            return (
              <SidebarContent>
                <NavMain content={ brandRoutes.dashboard } />
                <NavMain content={ brandRoutes.productManagement } />
                {/* <NavMain content={ brandRoutes.ingredientRecipeManagement } /> */ }
                {/* <NavMain content={ brandRoutes.taxManagement } /> */ }
                <NavMain content={ brandRoutes.promotionCampaignManagement } />
                <NavMain content={ brandRoutes.storeManagement } />
                <NavMain content={ brandRoutes.generalManagement } />
              </SidebarContent>
            );

          case "StoreAdmin":
            return (
              <SidebarContent>
                <NavMain content={ storeRoutes.dashboard } />
                <NavMain content={ storeRoutes.sales } />
                <NavMain content={ storeRoutes.operation } />
                <NavMain content={ storeRoutes.settings } />
              </SidebarContent>
            );
          case "SystemAdmin":
            return (
              <SidebarContent>
                <NavMain content={ adminRoutes.dashboard } />
                <NavMain content={ adminRoutes.brand } />
                <NavMain content={ adminRoutes.systemManagement } />
              </SidebarContent>
            );
          default:
            return null;
        }
      } )() }
      <SidebarRail />
    </Sidebar>
  );
}

import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TPromotionRuleResponse>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="font-semibold text-base">Tên khuyến mãi</div>
    ),
    cell: ( info ) =>
    {
      const name = info.getValue() as string;
      return (
        <div className="max-w-[250px]">
          <div
            className="text-foreground truncate cursor-pointer hover:text-primary transition-colors text-base font-normal"
            title={ name } // Tooltip for full name on hover
          >
            { name }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="font-semibold text-base">Mô tả</div>,
    cell: ( info ) =>
    {
      const description = info.getValue() as string;
      return (
        <div className="flex justify-start">
          <div
            // variant="secondary"
            className={ `flex items-center gap-1.5 max-w-[400px] truncate text-base font-normal` }
            title={ description }
          >
            { description }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    // header: () => <div className="font-semibold text-base">Độ ưu tiên</div>,
    header: () => (
      <div className="font-semibold text-base">Độ ưu tiên</div>
    ),
    cell: ( info ) =>
    {
      const priority = info.getValue() as string;
      return (
        <div className="flex justify-center">
          <div
            // variant="secondary"
            className={ `flex items-center gap-1.5 max-w-[400px] truncate text-base font-normal` }
            title={ priority }
          >
            { priority }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <div className="text-center font-semibold text-base">Trạng thái</div>
    ),
    cell: ( info ) =>
    {
      const isActive = info.getValue() as boolean;

      return (
        <div className="flex justify-center">
          <div
            className={ `flex items-center gap-1.5 px-3 py-1 rounded text-base ${ isActive
              ? "bg-green-mint-10 text-green-mint-100"
              : "bg-neutral-10 text-neutral-90"
              }` }
          >
            {/* Status indicator with both visual and text cues */ }
            { isActive ? <>Hoạt động</> : <>Không hoạt động</> }
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao Tác</div>
    ),
    cell: ( { row } ) =>
    {
      const promotion = row.original;

      return (
        <div className="flex justify-center">
          <Link to={ PATH_BRAND_DASHBOARD.promotion.editPromotion( promotion.id ) }>
            <div className="group relative flex items-center cursor-pointer">
              <Eye className="h-4 w-4 text-blue-600" />
              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs
                          whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
              >
                Xem chi tiết
              </span>
            </div>
          </Link>
        </div>
      );
    },
    size: 80,
  },
];


export const selectedColumns: ColumnDef<TPromotionRuleResponse>[] = [
  {
    id: "select",
    header: ( { table } ) => <RowSelectHeader table={ table } />,
    cell: ( { row } ) => <RowSelectCell row={ row } />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="font-semibold text-base">Tên khuyến mãi</div>
    ),
    cell: ( info ) =>
    {
      const name = info.getValue() as string;
      return (
        <div className="max-w-[250px]">
          <div
            className="text-foreground truncate cursor-pointer hover:text-primary transition-colors text-base font-normal"
            title={ name } // Tooltip for full name on hover
          >
            { name }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="font-semibold text-base">Mô tả</div>,
    cell: ( info ) =>
    {
      const description = info.getValue() as string;
      return (
        <div className="flex justify-start">
          <div
            // variant="secondary"
            className={ `flex items-center gap-1.5 max-w-[400px] truncate text-base font-normal` }
            title={ description }
          >
            { description }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    // header: () => <div className="font-semibold text-base">Độ ưu tiên</div>,
    header: () => (
      <div className="font-semibold text-base">Độ ưu tiên</div>
    ),
    cell: ( info ) =>
    {
      const priority = info.getValue() as string;
      return (
        <div className="flex justify-center">
          <div
            // variant="secondary"
            className={ `flex items-center gap-1.5 max-w-[400px] truncate text-base font-normal` }
            title={ priority }
          >
            { priority }
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <div className="text-center font-semibold text-base">Trạng thái</div>
    ),
    cell: ( info ) =>
    {
      const isActive = info.getValue() as boolean;

      return (
        <div className="flex justify-center">
          <div
            className={ `flex items-center gap-1.5 px-3 py-1 rounded text-base ${ isActive
              ? "bg-green-mint-10 text-green-mint-100"
              : "bg-neutral-10 text-neutral-90"
              }` }
          >
            {/* Status indicator with both visual and text cues */ }
            { isActive ? <>Hoạt động</> : <>Không hoạt động</> }
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao Tác</div>
    ),
    cell: ( { row } ) =>
    {
      const promotion = row.original;

      return (
        <div className="flex justify-center">
          <Link to={ PATH_BRAND_DASHBOARD.promotion.editPromotion( promotion.id ) }>
            <div className="group relative flex items-center cursor-pointer">
              <Eye className="h-4 w-4 text-blue-600" />
              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs
                          whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
              >
                Xem chi tiết
              </span>
            </div>
          </Link>
        </div>
      );
    },
    size: 80,
  },
];

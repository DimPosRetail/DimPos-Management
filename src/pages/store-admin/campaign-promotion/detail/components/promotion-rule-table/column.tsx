import
{
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

type ColumnProps = {
  onViewDetail: ( promotion: TPromotionRuleResponse ) => void;
};

export const createColumns = ( {
  onViewDetail,
}: ColumnProps ): ColumnDef<TPromotionRuleResponse>[] => [
    {
      accessorKey: "name",
      header: ( { column } ) =>
        createFormattedHeader( "Tên khuyến mãi", column, { align: "left" } ),
      cell: ( info ) =>
      {
        const name = info.getValue() as string;
        return createFormattedCell(
          <span
            className="text-foreground cursor-pointer hover:text-primary transition-colors text-base font-normal"
            title={ name } // Tooltip for full name on hover
          >
            { name }
          </span>,
          {
            align: "left",
            maxWidth: "250px",
            truncate: true,
            tooltip: name,
          }
        );
      },
      size: 250,
    },
    {
      accessorKey: "description",
      header: ( { column } ) =>
        createFormattedHeader( "Mô tả", column, { align: "left" } ),
      cell: ( info ) =>
      {
        const description = info.getValue() as string;
        return (
          <div className="flex justify-start">
            <div
              className={ `flex items-center gap-1.5 max-w-[400px] truncate text-base font-normal` }
              title={ description }
            >
              { description }
            </div>
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: "priority",
      header: ( { column } ) =>
        createFormattedHeader( "Độ ưu tiên", column, { align: "center" } ),
      cell: ( info ) =>
      {
        const priority = info.getValue() as string;
        return createFormattedCell(
          <span
            className={ `text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block` }
            title={ priority }
          >
            { priority }
          </span>,
        );
      },
      size: 120,
    },
    {
      accessorKey: "isActive",
      header: ( { column } ) =>
        createFormattedHeader( "Trạng thái", column, { align: "center" } ),
      cell: ( info ) =>
      {
        const isActive = info.getValue() as boolean;

        return createSimpleStatusBadge( { isActive } );
      },
      size: 120,
    },
    {
      id: "actions",
      header: ( { column } ) =>
        createFormattedHeader( "Thao tác", column, { align: "center" } ),
      cell: ( { row } ) =>
      {
        const promotion = row.original;

        return createFormattedCell(
          <div className="flex justify-center">
            <div
              className="group relative flex items-center cursor-pointer"
              onClick={ () => onViewDetail( promotion ) }
            >
              <Eye className="h-4 w-4 text-blue-600" />
              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs
                          whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
              >
                Xem chi tiết
              </span>
            </div>
          </div>
        );
      },
      size: 80,
    },
  ];

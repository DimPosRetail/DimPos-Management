import { createFormattedCell, createFormattedHeader, createSimpleStatusBadge } from "@/components/table/table-formatter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TBrandMenu } from "@/schema/menu.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TBrandMenu>[] = [
  {
    accessorKey: "id",
    header: ({column}) => createFormattedHeader("STT", column, { align: "center" }),
    cell: ( info ) =>
    {
      return createFormattedCell( (info.row.index + 1).toString(), { align: "center" } );
    },
  },
  {
    accessorKey: "name",
    header:({column}) => createFormattedHeader("Tên thực đơn", column, { align: "left" }),
    cell: ( info ) =>
    {
      const name = info.getValue() as string;
      return createFormattedCell(
        <div className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {name}
        </div>,
        {
          align: "left",
          maxWidth: "200px",
          truncate: true,
          tooltip: name,
        }
      );
    },
    size: 200,
  },
  {
    accessorKey: "isActiveByBrand",
    header: ({ column }) => createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ( info ) =>
    {
      const isActiveByBrand = info.getValue() as boolean;
      return createSimpleStatusBadge( { isActive: isActiveByBrand,inactiveText: "Ẩn" } );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-base">Thao tác</div>
    ),
    cell: ( { row } ) =>
    {
      const menu = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={ PATH_BRAND_DASHBOARD.product.editMenu( menu.id ) }>
                <TooltipTrigger>
                  <Eye className="h-4 w-4 hover:cursor-pointer" />
                  <TooltipContent>
                    <div className="text-base">Xem chi tiết</div>
                  </TooltipContent>
                </TooltipTrigger>
              </Link>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 80, // Fixed width for consistent layout
  },
];

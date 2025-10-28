import {
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TModifierGroupResponse } from "@/schema/product.schema";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns =
  (): // onViewOption: ( data: TModifierGroupResponse ) => void
  ColumnDef<TModifierGroupResponse>[] => [
    {
      accessorKey: "id",
      header: ({ column }) =>
        createFormattedHeader("STT", column, { align: "center" }),
      cell: (info) => {
        return createFormattedCell((info.row.index + 1).toString(), {
          align: "center",
        });
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) =>
        createFormattedHeader("Tên tùy chọn", column, { align: "left" }),
      cell: (info) => {
        const name = info.getValue() as string;
        return (
          <div className="max-w-[200px]">
            <div className="font-normal text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors">
              {name}
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "selectedType",
      header: ({ column }) =>
        createFormattedHeader("Hình thức chọn", column, { align: "center" }),
      cell: (info) => {
        const selectedType = info.getValue() as number;
        const label =
          selectedType === 0
            ? "Một"
            : selectedType === 1
            ? "Nhiều"
            : "Không xác định";

        return createFormattedCell(
          <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-bloc">
            {label}
          </span>,
          {
            align: "center",
          }
        );
      },
      size: 200,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) =>
        createFormattedHeader("Trạng thái", column, { align: "center" }),
      cell: (info) => {
        const status = info.getValue() as boolean;

        return createSimpleStatusBadge({ isActive: status });
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center font-semibold text-base">Thao tác</div>
      ),
      cell: ({ row }) => {
        const group = row.original;

        return (
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={PATH_BRAND_DASHBOARD.product.editModifier(group.id)}
                  >
                    <Eye
                      className="h-4 w-4 hover:cursor-pointer"
                      // onClick={ () => onViewOption( group ) }
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">Xem chi tiết</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
      size: 80,
    },
  ];

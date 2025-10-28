import {
    createFormattedCell,
    createFormattedHeader,
    createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { PATH_STORE_DASHBOARD } from "@/routes/path";
import type { TStoreMenu } from "@/schema/menu.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TStoreMenu>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => createFormattedHeader("STT", column),
    cell: (info) => {
      return createFormattedCell(
        <div className="text-base text-center">{info.row.index + 1}</div>,
        {
          align: "center",
        }
      );
    },
    size: 60,
  },
  {
    id: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên thực đơn", column, { align: "left" }),
    cell: ({ row }) => {
      const name = row.original.brandMenu.name as string;
      return createFormattedCell(<span>{name}</span>, {
        align: "left",
        tooltip: name,
      });
    },
    size: 200,
  },
  {
    id: "description",
    header: ({ column }) =>
      createFormattedHeader("Mô tả", column, { align: "left" }),
    cell: ({ row }) => {
      const description = row.original.brandMenu.description as string;
      return createFormattedCell(<span>{description}</span>, {
        align: "left",
        tooltip: description,
      });
    },
    size: 200,
  },
  {
    accessorKey: "isActiveAtStore",
    header: ({ column }) => createFormattedHeader("Trạng thái", column),
    cell: (info) => {
      const isActiveAtStore = info.getValue() as boolean;
      return createSimpleStatusBadge({ isActive: isActiveAtStore });
    },
  },
  {
    id: "actions",
    header: ({ column }) => createFormattedHeader("Thao tác", column),
    cell: ({ row }) => {
      const menu = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={PATH_STORE_DASHBOARD.menu.detail(menu.id)}>
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
    size: 80,
  },
];

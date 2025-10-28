import {
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TPromotionRuleResponse } from "@/schema/promotion-rule.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TPromotionRuleResponse>[] = [
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
    header: ({ column }) =>
      createFormattedHeader("Tên khuyến mãi", column, { align: "left" }),
    cell: ({ row }) => {
      const name = row.original.name;
      const shortDescription = row.original.shortDescription;
      return createFormattedCell(
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-muted-foreground">
            {shortDescription}
          </span>
        </div>,
        {
          align: "left",
          maxWidth: "300px",
          truncate: true,
          tooltip: name,
        }
      );
    },
    size: 300,
  },
  //   {
  //     accessorKey: "description",
  //     header: () => <div className="font-semibold text-base">Mô tả</div>,
  //     cell: (info) => {
  //       const description = info.getValue() as string;
  //       return (
  //         <div className="flex justify-start">
  //           <div
  //             className={`flex items-center gap-1.5 max-w-[300px] truncate text-sm font-normal`}
  //             title={description}
  //           >
  //             {description}
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  {
    accessorKey: "priority",
    header: ({ column }) =>
      createFormattedHeader("Độ ưu tiên", column, {
        align: "center",
        sortable: true,
      }),
    cell: ({ row }) => {
      const priority = row.original.priority;
      const variant =
        priority > 5 ? "destructive" : priority > 2 ? "default" : "secondary";

      return createFormattedCell(
        <div className="flex justify-center">
          <Badge variant={variant} className="w-16 justify-center items-center">
            {priority}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const isActive = info.getValue() as boolean;

      return createSimpleStatusBadge({ isActive });
    },
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Thao tác", column, {
        align: "center",
        sortable: true,
      }),
    cell: ({ row }) => {
      const promotion = row.original;
      return (
        <div className="flex justify-center">
          <Link to={PATH_BRAND_DASHBOARD.promotion.editPromotion(promotion.id)}>
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
  },
];

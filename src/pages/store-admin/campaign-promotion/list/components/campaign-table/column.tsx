import {
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge,
} from "@/components/table/table-formatter";
import { PATH_STORE_DASHBOARD } from "@/routes/path";
import type { TCampaignResponse } from "@/schema/campaign.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<TCampaignResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên chiến dịch", column, { align: "left" }),
    cell: (info) => {
      const name = info.getValue() as string;
      return createFormattedCell(name, { align: "left" });
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) =>
      createFormattedHeader("Mô tả", column, { align: "left" }),
    cell: (info) => {
      const description = info.getValue() as string;
      return createFormattedCell(description, {
        align: "left",
        truncate: true,
        tooltip: description,
      });
    },
  },
  {
    accessorKey: "priority",
    // header: () => <div className="font-semibold text-base">Độ ưu tiên</div>,
    header: ({ column }) =>
      createFormattedHeader("Độ ưu tiên", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const priority = info.getValue() as number;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {priority}
        </span>
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
      }),
    cell: ({ row }) => {
      const campaign = row.original;
      const navigate = useNavigate();

      return (
        <div className="flex justify-center">
          <div
            className="group relative flex items-center cursor-pointer"
            onClick={() =>
              navigate(
                PATH_STORE_DASHBOARD.campaignPromotion.detail(campaign.id)
              )
            }
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

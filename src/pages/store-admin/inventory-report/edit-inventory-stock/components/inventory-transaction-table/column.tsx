import { SortableHeader } from "@/components/table/sortable-header";
import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TInventoryTransaction } from "@/schema/inventory.schema";
import {
  getInventoryTransactionTypeLabel,
  type TInventoryTransactionTypeEnum,
} from "@/types/enums/inventory-type.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const columns: ColumnDef<TInventoryTransaction>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <SortableHeader column={column}>Loại giao dịch</SortableHeader>
    ),
    cell: (info) => {
      const type = info.getValue() as TInventoryTransactionTypeEnum;
      const { label, className } = getInventoryTransactionTypeLabel(type);
      return createFormattedCell(
        <span
          className={`inline-flex items-center justify-end font-semibold text-sm ${className} px-2 py-1 rounded-md border`}
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) =>
      createFormattedHeader("Ngày giao dịch", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const createdDate = info.getValue() as Date;
      return createFormattedCell(
        <span className="text-sm font-normal text-muted-foreground font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {format(createdDate, "dd/MM/yyyy, HH:mm", { locale: vi })}
        </span>
      );
    },
  },
  {
    accessorKey: "quantityChange",
    header: ({ column }) =>
      createFormattedHeader("Số lượng thay đổi", column, {
        align: "center",
        sortable: true,
      }),
    cell: (info) => {
      const quantity = info.getValue() as number;
      const isNegative = quantity < 0;
      const colorClass = isNegative ? "text-red-500 bg-red-10 border border-red-500" : "text-green-500 bg-green-10 border border-green-500";
      return createFormattedCell(
        <span className={`inline-flex items-center justify-end font-semibold text-sm ${colorClass} px-2 py-1 rounded-md border`}>
          {isNegative ? `- ${Math.abs(quantity)}` : `+ ${quantity}`}
        </span>
      );
    },
  },
  {
    accessorKey: "reasonManualAdjustment",
    header: ({column}) => createFormattedHeader("Lý do điều chỉnh", column, {align: "left"}),
    cell: (info) => {
      const reason = info.getValue() as string;
      return createFormattedCell(
        <div className="flex justify-start max-w-[250px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm font-normal text-muted-foreground break-words overflow-hidden text-ellipsis">
                {reason || "Không có"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{reason || "Không có"}</span>
            </TooltipContent>
          </Tooltip>
        </div>,{
            align: "left",
            truncate: true,
            tooltip: reason || "Không có",
        }
      );
    },
    size: 200,
  },
  {
    accessorKey: "note",
    header: ({column}) => createFormattedHeader("Ghi chú", column, {align: "left"}),
    cell: (info) => {
      const note = info.getValue() as string;
      return createFormattedCell(
        <div className="flex justify-start max-w-[250px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm font-normal text-muted-foreground break-words overflow-hidden text-ellipsis">
                {note || "Không có"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{note || "Không có"}</span>
            </TooltipContent>
          </Tooltip>
        </div>,{
            align: "left",
            truncate: true,
            tooltip: note || "Không có",
        }
      );
    },
    size: 200,
  },
];

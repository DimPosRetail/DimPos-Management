import { Button } from "@/components/ui/button";
import type { RootState } from "@/redux/store";
import { PATH_BRAND_DASHBOARD, PATH_STORE_DASHBOARD } from "@/routes/path";
import type { TCampaignResponse } from "@/schema/campaign.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Enhanced sortable header component that provides visual feedback for all sorting states
const SortableHeader = ( {
  column,
  children,
}: {
  column: any;
  children: React.ReactNode;
} ) =>
{
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={ () => column.toggleSorting( sorted === "asc" ) }
      className="hover:bg-muted/50 -ml-3 h-8 data-[state=open]:bg-accent"
    >
      <span className="font-semibold text-base">{ children }</span>
      {/* Visual indicator for sorting state - shows all three states clearly */ }
      { sorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      ) }
    </Button>
  );
};

export const columns: ColumnDef<TCampaignResponse>[] = [
  {
    accessorKey: "name",
    header: ( { column } ) => (
      <SortableHeader column={ column }>Tên chiến dịch</SortableHeader>
    ),
    cell: ( info ) =>
    {
      const name = info.getValue() as string;
      return (
        <div className="max-w-[250px]">
          <div
            className="text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm font-normal"
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
            className={ `flex items-center gap-1.5 max-w-[400px] truncate text-sm font-normal` }
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
    header: ( { column } ) => (
      <SortableHeader column={ column }>Độ ưu tiên</SortableHeader>
    ),
    cell: ( info ) =>
    {
      const priority = info.getValue() as string;
      return (
        <div className="flex justify-center">
          <div
            // variant="secondary"
            className={ `flex items-center gap-1.5 max-w-[400px] truncate text-sm font-normal` }
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
      <div className="text-center font-semibold text-base">Trạng Thái</div>
    ),
    cell: ( info ) =>
    {
      const isActive = info.getValue() as boolean;

      return (
        <div className="flex justify-center">
          <div
            // variant={ isVisible ? "default" : "secondary" }
            className={ `flex items-center gap-1.5 px-3 py-1 rounded text-sm ${ isActive
              ? "bg-green-mint-10 text-green-mint-100"
              : "bg-neutral-10 text-neutral-100"
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
      const campaign = row.original;
      const { role } = useSelector( ( state: RootState ) => state.user );

      return (
        <div className="flex justify-center">
          <Link to={ role === "BrandAdmin" ? PATH_BRAND_DASHBOARD.campaign.editCampaign( campaign.id ) : PATH_STORE_DASHBOARD.campaignPromotion.detail( campaign.id ) }>
            <div
              className="group relative flex items-center cursor-pointer"
            >
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

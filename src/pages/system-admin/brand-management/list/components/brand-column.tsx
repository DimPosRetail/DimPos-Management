import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, copyToClipboard } from "@/lib/utils";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TBrandResponse } from "@/schema/brand-management.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<TBrandResponse>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold text-base">Tên thương hiệu</div>,
    cell: ( info ) =>
    {
      const name = info.getValue() as string;
      return <div className="font-medium truncate text-base">{ name }</div>;
    },
  },
  {
    accessorKey: "code",
    header: () => <div className="font-semibold text-base">Mã thương hiệu</div>,
    cell: ( info ) =>
    {
      const code = info.getValue() as string;
      return (
        <div className="flex items-center gap-2 max-w-[180px]">
          <Badge variant="secondary" className="font-mono text-base truncate">
            { code }
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={ () => copyToClipboard( code, "Mã thương hiệu" ) }
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="font-semibold text-base">Email</div>,
    cell: ( info ) =>
    {
      const email = info.getValue() as string;
      return <div className="text-base font-normal text-gray-700">{ email }</div>;
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="font-semibold text-base">SĐT</div>,
    cell: ( info ) =>
    {
      const phone = info.getValue() as string;
      return <div className="text-base font-normal text-gray-700">{ phone }</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold text-base">Trạng thái</div>,
    cell: ( info ) =>
    {
      const status = info.getValue() as number;
      return (
        <div className="flex justify-center">
          <Badge
            className={
              cn( status === 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600", "text-base" )
            }
          >
            { status === 0 ? "Hoạt động" : "Ngừng hoạt động" }
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold text-base">Thao tác</div>,
    cell: ( { row } ) =>
    {
      const brand = row.original;

      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <Link to={ PATH_ADMIN_DASHBOARD.brand.edit( brand.id ) }>
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
  },
];
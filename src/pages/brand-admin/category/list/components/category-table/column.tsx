import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createActionDropdown,
  createFormattedCell,
  createFormattedHeader,
  createSimpleStatusBadge,
  createTypeBadge,
} from "@/components/table/table-formatter";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { TCategoryResponse } from "@/schema/category.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, Folder, FolderOpen, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "@/lib/utils";

export const columns: ColumnDef<TCategoryResponse>[] = [
  {
    accessorKey: "code",
    header: ({ column }) =>
      createFormattedHeader("Mã danh mục", column, { sortable: true , align: "left"}),
    cell: (info) => {
      const code = info.getValue() as string;
      return createFormattedCell(
        // <span className="font-mono font-medium text-gray-800">{code}</span>,
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-medium text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200 cursor-pointer"
          >
            {code}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-50 rounded-md transition-colors"
            onClick={() => copyToClipboard(code, "Mã danh mục")}
          >
            <Copy className="h-3.5 w-3.5 text-blue-500 hover:text-blue-700" />
          </Button>
        </div>,
        {
          maxWidth: "280px",
          truncate: true,
          tooltip: code,
          className: "px-2",
          align: "left",
        }
      );
    },
    size: 280,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      createFormattedHeader("Tên danh mục", column, {
        sortable: true,
        align: "left",
      }),
    cell: (info) => {
      const name = info.getValue() as string;
      return createFormattedCell(
        <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
          {name}
        </span>,
        {
          align: "left",
          maxWidth: "300px",
          truncate: true,
          tooltip: name,
          className: "px-2",
        }
      );
    },
    size: 300,
  },
  {
    accessorKey: "type",
    header: () => createFormattedHeader("Loại danh mục"),
    //   (
    //   <div className="text-center font-semibold text-base">Loại danh mục</div>
    // ),
    cell: (info) => {
      const type = info.getValue() as number;
      return createTypeBadge(
        type,
        {
          icon: <FolderOpen className="h-3.5 w-3.5" />,
          text: "Danh mục cha",
          className: "bg-purple-10 text-purple-100 border-purple-100",
        },
        {
          icon: <Folder className="h-3.5 w-3.5" />,
          text: "Danh mục con",
          className: "bg-blueberry-10 text-blueberry-100 border-blueberry-100",
        }
      );
    },
    size: 150,
  },
  {
    accessorKey: "displayOrder",
    header: ({ column }) =>
      createFormattedHeader("Thứ tự", column, { sortable: true }),
    cell: (info) => {
      const order = info.getValue() as number;
      return createFormattedCell(
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md min-w-[2rem] inline-block">
          {order}
        </span>
      );
    },
    size: 120,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { sortable: true }),
    cell: (info) => {
      const status = info.getValue() as number;
      const isActive = status === 0;

      return createSimpleStatusBadge({ isActive: isActive });
    },
    size: 130,
  },
  {
    id: "actions",
    header: ({column}) => createFormattedHeader("Thao tác", column),
    //   (
    //   <div className="text-center font-semibold text-base">Thao Tác</div>
    // ),
    cell: ({ row }) => {
      const category = row.original;
      const navigate = useNavigate();
      const menuItems = [
        {
          label: "Xem chi tiết",
          icon: <Eye className="h-4 w-4 text-blue-600" />,
          onClick: () =>
            navigate(PATH_BRAND_DASHBOARD.category.edit(category.id)),
          className: "hover:bg-blue-50 focus:bg-blue-50",
        },
        {
          label: "Sao chép mã",
          icon: <Copy className="h-4 w-4 text-gray-600" />,
          onClick: () => copyToClipboard(category.code, "Mã danh mục"),
          className: "hover:bg-gray-50 focus:bg-gray-50",
        },
      ];
      const trigger = (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-muted rounded-md"
          title="Xem thêm thao tác"
        >
          <span className="sr-only">Mở menu thao tác</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
      return createActionDropdown(
        trigger,
        menuItems,
        `Thao tác cho "${category.name}"`
      );
      // (
      //   <div className="flex justify-center">
      //     <DropdownMenu>
      //       <DropdownMenuTrigger asChild>
      //         <Button
      //           variant="ghost"
      //           className="h-8 w-8 p-0 hover:bg-muted"
      //           title="Xem thêm thao tác"
      //         >
      //           <span className="sr-only">Mở menu thao tác</span>
      //           <MoreHorizontal className="h-4 w-4" />
      //         </Button>
      //       </DropdownMenuTrigger>
      //       <DropdownMenuContent align="end" className="w-48">
      //         <DropdownMenuLabel className="text-xs text-muted-foreground">
      //           Thao tác cho "{category.name}"
      //         </DropdownMenuLabel>
      //         <DropdownMenuSeparator />
      //         {/* Xem chi tiết thay cho Chỉnh sửa */}
      //         <DropdownMenuItem
      //           className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
      //           onClick={() =>
      //             navigate(PATH_BRAND_DASHBOARD.category.edit(category.id))
      //           }
      //         >
      //           <Eye className="mr-2 h-4 w-4 text-blue-600" />
      //           <span className="text-blue-700">Xem chi tiết</span>
      //         </DropdownMenuItem>

      //         <DropdownMenuItem
      //           className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      //           onClick={() => copyToClipboard(category.code, "Mã danh mục")}
      //         >
      //           <Copy className="mr-2 h-4 w-4 text-gray-600" />
      //           <span className="text-gray-700">Sao chép mã</span>
      //         </DropdownMenuItem>
      //       </DropdownMenuContent>
      //     </DropdownMenu>
      //   </div>
      // );
    },
    size: 80,
  },
];

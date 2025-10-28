import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { SortableHeader } from "@/components/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn, copyToClipboard, formatPrice } from "@/lib/utils";
import type { TIngredientResponse } from "@/schema/ingredients.schema";
import type { TPriceProductHistory, TRecipeItemResponse } from "@/schema/product-variant.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Copy, Edit, MoreHorizontal, Trash, TrendingDown, TrendingUp } from "lucide-react";

export const columns = (
    onViewOption: ( data: TRecipeItemResponse ) => void,
    onDeleteOption: ( recipeItemId: string ) => void
): ColumnDef<TRecipeItemResponse>[] => [
        {
            id: "index",
            header: () => (
                <div className="flex font-semibold text-base justify-center max-w-[50px]">
                    STT
                </div>
            ),
            cell: ( info ) =>
            {
                const table = info.table;
                const row = info.row;
                const currentPage = table.getState().pagination.pageIndex;
                const currentSize = table.getState().pagination.pageSize;
                return (
                    <div className="">
                        <div className="flex items-center gap-2 text-base justify-center  max-w-[50px]">
                            { row.index + currentPage * currentSize + 1 }
                        </div>
                    </div>
                );
            },
        },
        {
            id: "ingredientCode",
            header: () => <div className="font-semibold text-base">Mã Thành Phần</div>,
            cell: ( { row } ) =>
            {
                const code = row.original.ingredient.code;
                return (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm font-normal">
                            { code }
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted"
                            onClick={ () => copyToClipboard( code, "Mã Thành Phần" ) }
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                );
            },
        },
        {
            id: "ingredientName",
            header: () => <div className="font-semibold text-base">Tên Thành Phần</div>,
            cell: ( { row } ) =>
            {
                const name = row.original.ingredient.name;
                return (
                    <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm">{ name }</div>
                );
            },
        },
        {
            id: "ingredientMeasureUnit",
            header: () => <div className="font-semibold text-base text-center">Đơn vị tính</div>,
            cell: ( { row } ) =>
            {
                const measureUnit = row.original.ingredient.measureUnit;
                return <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm text-center">{ measureUnit }</div>;
            },
        },
        {
            accessorKey: "quantity",
            header: () => <div className="font-semibold text-base text-center">Số lượng</div>,
            cell: ( info ) =>
            {
                const quantity = info.getValue() as number;
                return <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm text-center">{ quantity }</div>;
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="text-center font-semibold text-base">Thao Tác</div>
            ),
            cell: ( { row } ) =>
            {
                const recipeItem = row.original;

                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                    title="Xem thêm thao tác"
                                >
                                    <span className="sr-only">Mở menu thao tác</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Thao tác
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* Xem chi tiết thay cho Chỉnh sửa */ }
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                                    onClick={ () =>
                                    { onViewOption( recipeItem ) }
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                    <span className="text-blue-700">Chỉnh sửa số lượng</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                                    onClick={ () =>
                                    { onDeleteOption( recipeItem.id ) }
                                    }
                                >
                                    <Trash className="mr-2 h-4 w-4 text-red-600" />
                                    <span className="text-red-700">Xóa</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            size: 80,
        },
    ];

export const ingredientColumns: ColumnDef<TIngredientResponse>[] = [
    {
        id: "select",
        header: ( { table } ) => (
            <RowSelectHeader table={ table } />
        ),
        cell: ( { row } ) => (
            <RowSelectCell row={ row } />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "code",
        header: () => <div className="font-semibold text-base">Mã</div>,
        cell: ( info ) =>
        {
            const code = info.getValue() as string;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm font-normal">
                        { code }
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={ () => copyToClipboard( code, "Mã thành phần" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: () => <div className="font-semibold text-base">Tên thành phần</div>,
        cell: ( info ) =>
        {
            const name = info.getValue() as string;
            return (
                <div className="max-w-[250px]">
                    <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-sm">
                        { name }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "sku",
        header: () => <div className="font-semibold text-base">Mã SKU</div>,
        cell: ( info ) =>
        {
            const sku = info.getValue() as string;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm font-normal">
                        { sku }
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={ () => copyToClipboard( sku, "Mã SKU" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "measureUnit",
        header: () => <div className="font-semibold text-base">Đơn vị tính</div>,
        cell: ( info ) =>
        {
            const measureUnit = info.getValue() as string;
            return <div className="text-sm">{ measureUnit }</div>;
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
                        className={ `flex items-center gap-1.5 px-3 py-1 rounded text-sm font-normal ${ isActive
                            ? "bg-green-mint-10 text-green-mint-100"
                            : "bg-red-10 text-red-100"
                            }` }
                    >
                        { isActive ? <>Hoạt động</> : <>Không hoạt động</> }
                    </div>
                </div>
            );
        },
    },
];

export const brandPriceHistoryColumns: ColumnDef<TPriceProductHistory>[] = [
    {
        id: "index",
        header: () => (
            <div className="flex font-semibold text-base justify-center max-w-[50px]">
                STT
            </div>
        ),
        cell: ( info ) =>
        {
            const table = info.table;
            const row = info.row;
            const currentPage = table.getState().pagination.pageIndex;
            const currentSize = table.getState().pagination.pageSize;
            return (
                <div className="">
                    <div className="flex items-center gap-2 text-base justify-center  max-w-[50px]">
                        { row.index + currentPage * currentSize + 1 }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "oldPrice",
        header: () => <div className="font-semibold text-base">Giá cũ</div>,
        cell: ( info ) =>
        {
            const oldPrice = info.getValue() as number;
            return (
                <div className="text-start">
                    <Badge
                        variant="default"
                        className="bg-orange-10 text-orange-800 hover:bg-orange-200 text-base"
                    >
                        { formatPrice( oldPrice ) }
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "newPrice",
        header: () => <div className="font-semibold text-base">Giá mới</div>,
        cell: ( info ) =>
        {
            const newPrice = info.getValue() as number;
            return (
                <div className="text-start">
                    <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-200 text-base"
                    >
                        { formatPrice( newPrice ) }
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "currencyCode",
        header: () => <div className="font-semibold text-base text-center">Đơn vị tiền tệ</div>,
        cell: ( info ) =>
        {
            const code = info.getValue() as string;
            return (
                <div className="text-center">
                    <Badge
                        variant="default"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-base"
                    >
                        { code }
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "rate",
        header: () => <div className="font-semibold text-base text-center">Tỉ lệ thay đổi</div>,
        cell: ( { row } ) =>
        {
            const oldPrice = row.original.oldPrice;
            const newPrice = row.original.newPrice;
            const rate = oldPrice && newPrice ? ( ( newPrice - oldPrice ) / oldPrice * 100 ) : 0;
            return (
                <div className="text-center">
                    <Badge
                        variant="default"
                        className={ cn( rate >= 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-10 text-red-800 hover:bg-red-200", " text-base" ) }
                    >
                        { rate >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" /> }{ ' ' }
                        { rate ? rate.toFixed( 2 ) : 0 }%
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "changedAt",
        header: ( { column } ) => <SortableHeader column={ column } >Thời gian thay đổi</SortableHeader>,
        cell: ( info ) =>
        {
            const changedAt = info.getValue() as string;
            const date = new Date( changedAt );
            return (
                <div className="text-base text-center">
                    { format( date, "dd/MM/yyyy hh:mm aa", { locale: vi } ) }
                </div>
            );
        }
    },
];
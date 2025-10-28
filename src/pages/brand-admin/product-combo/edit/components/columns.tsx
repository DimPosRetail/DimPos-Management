import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import type { TComboProductItem } from "@/schema/combo-product.schema";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

export const columns = (
    onViewOption: ( data: TComboProductItem ) => void,
    onDeleteOption: ( comboProductItemId: string ) => void
): ColumnDef<TComboProductItem>[] => [
        {
            id: "code",
            header: () => <div className="font-semibold text-base">Mã sản phẩm</div>,
            cell: ( info ) =>
            {
                const code = info.row.original.productVariant.code as string;
                return (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-normal text-sm">
                            { code }
                        </Badge>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted"
                            onClick={ () => copyToClipboard( code, "Mã sản phẩm" ) }
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                );
            },
        },
        {
            id: "sku",
            header: () => <div className="font-semibold text-base">Mã SKU</div>,
            cell: ( info ) =>
            {
                const sku = info.row.original.productVariant.sku as string;
                return (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-normal text-sm">
                            { sku }
                        </Badge>
                        <Button
                            type="button"
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
            id: "name",
            header: () => <div className="font-semibold text-base">Tên sản phẩm</div>,
            cell: ( info ) =>
            {
                const name = info.row.original.productVariant.name as string;
                return (
                    <div className="max-w-[200px]">
                        <div className="font-normal text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors">
                            { name }
                        </div>
                    </div>
                );
            },
        },
        {
            id: "price",
            header: () => (
                <div className="text-right font-semibold text-base">Giá lẻ</div>
            ),
            cell: ( info ) =>
            {
                const price = info.row.original.productVariant.price as number;
                return (
                    <div className="text-right font-normal text-sm">
                        { formatPrice( price ) }
                    </div>
                );
            },
        },
        {
            accessorKey: "quantity",
            header: () =>
            {
                return <div className="text-center font-semibold">Số lượng</div>;
            },
            cell: ( info ) =>
            {
                const quantity = info.getValue() as number;
                return (
                    <div className="flex justify-center text-primary">
                        { quantity }
                    </div>
                );
            },
            size: 100,
        },
        {
            accessorKey: "displayOrder",
            header: () =>
            {
                return <div className="text-center font-semibold">TT Hiển thị</div>;
            },
            cell: ( info ) =>
            {
                const displayOrder = info.getValue() as number;
                return (
                    <div className="flex justify-center text-blue-500">
                        { displayOrder }
                    </div>
                );
            },
            size: 100,
        },
        {
            id: "actions",
            header: () => (
                <div className="text-center font-semibold text-base">Thao Tác</div>
            ),
            cell: ( { row } ) =>
            {
                const comboProductItem = row.original;

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
                                    { onViewOption( comboProductItem ) }
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                    <span className="text-blue-700">Chỉnh sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                                    onClick={ () =>
                                    { onDeleteOption( comboProductItem.id ) }
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

export const columnsForCreate: ColumnDef<TProductVariantResponse>[] = [
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
        header: () => <div className="font-semibold text-base">Mã sản phẩm</div>,
        cell: ( info ) =>
        {
            const code = info.getValue() as string;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal text-sm">
                        { code }
                    </Badge>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={ () => copyToClipboard( code, "Mã sản phẩm" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
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
                    <Badge variant="outline" className="font-normal text-sm">
                        { sku }
                    </Badge>
                    <Button
                        type="button"
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
        accessorKey: "name",
        header: () => <div className="font-semibold text-base">Tên sản phẩm</div>,
        cell: ( info ) =>
        {
            const name = info.getValue() as string;
            return (
                <div className="max-w-[200px]">
                    <div className="font-normal text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors">
                        { name }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: () => (
            <div className="text-right font-semibold text-base">Giá bán</div>
        ),
        cell: ( info ) =>
        {
            const price = info.getValue() as number;
            return (
                <div className="text-right font-normal text-sm">
                    { formatPrice( price ) }
                </div>
            );
        },
    }
];
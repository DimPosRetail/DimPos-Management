import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import
{
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyToClipboard, formatPrice } from "@/lib/utils";
import type { TPriceProductHistory, TProductVariantResponse } from "@/schema/product-variant.schema";
import type { TStoreMenu, TStoreProduct, TStoreTaxRate } from "@/schema/store.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Copy, Edit, Eye, MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export const columns = (
    isChangingStatus: boolean,
    onShowDetail: ( storeMenuId: string ) => void,
    onChangeStatus: ( storeMenuId: string, isActiveAtStore: boolean ) => Promise<void>,
): ColumnDef<TStoreMenu>[] => [
        {
            accessorKey: "id",
            header: () => <div className="font-semibold text-base text-center">STT</div>,
            cell: ( info ) =>
            {
                return (
                    <div className="text-base text-center">
                        { info.row.index + 1 }
                    </div>
                );
            },
        },
        {
            id: "name",
            header: () => <div className="font-semibold text-base">Tên thực đơn</div>,
            cell: ( { row } ) =>
            {
                const name = row.original.brandMenu.name as string;
                return (
                    <div className="max-w-[200px]">
                        <div className="font-normal text-base text-foreground truncate cursor-pointer hover:text-primary transition-colors">
                            { name }
                        </div>
                    </div>
                );
            },
        },
        {
            id: "description",
            header: () => <div className="font-semibold text-base">Mô tả</div>,
            cell: ( { row } ) =>
            {
                const description = row.original.brandMenu.description as string;
                return (
                    <div className="max-w-[200px]">
                        <div className="font-normal text-base text-foreground truncate cursor-pointer hover:text-primary transition-colors">
                            { description }
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "isActiveAtStore",
            header: () => (
                <div className="text-center font-semibold text-base">Trạng thái</div>
            ),
            cell: ( info ) =>
            {
                const isActiveAtStore = info.getValue() as boolean;
                return (
                    <div className="flex justify-center">
                        <Switch
                            disabled={ isChangingStatus }
                            checked={ isActiveAtStore }
                            onCheckedChange={ ( checked ) =>
                            {
                                const storeMenuId = info.row.original.id;
                                onChangeStatus( storeMenuId, checked );
                            } }
                        />
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="text-center font-semibold text-base">Thao tác</div>
            ),
            cell: ( { row } ) =>
            {
                const menu = row.original;

                return (
                    <div className="flex justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger onClick={ () =>
                                {
                                    console.log( "menu", menu );
                                    onShowDetail( menu.id );
                                } }>
                                    <Eye className="h-4 w-4 hover:cursor-pointer" />
                                    <TooltipContent>
                                        <div className="text-base">Xem chi tiết</div>
                                    </TooltipContent>
                                </TooltipTrigger>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            },
            size: 80, // Fixed width for consistent layout
        },
    ];

export const productColumns: ColumnDef<TProductVariantResponse>[] = [
    {
        id: "select",
        header: ( { table } ) => <RowSelectHeader table={ table } />,
        cell: ( { row } ) => <RowSelectCell row={ row } />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "code",
        header: () => <div className="font-semibold  text-sm">Mã sản phẩm</div>,
        cell: ( info ) =>
        {
            const code = info.getValue() as string;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm">
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
        header: () => <div className="font-semibold  text-sm">SKU</div>,
        cell: ( info ) =>
        {
            const altCode = info.getValue() as string;

            // Handle case where alternative code might be empty or null
            if ( !altCode )
            {
                return (
                    <div className="flex items-center gap-2 ">
                        <Badge variant="outline" className="text-muted-foreground">
                            Không có
                        </Badge>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="font-mono text-sm">
                        { altCode }
                    </Badge>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={ () => copyToClipboard( altCode, "Mã SKU" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: () => <div className="font-semibold text-sm">Tên sản phẩm</div>,
        cell: ( info ) =>
        {
            const name = info.getValue() as string;
            return (
                <div className="max-w-[20em]">
                    <div className="font-base text-foreground text-sm truncate cursor-pointer hover:text-primary transition-colors">
                        { name }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "size",
        header: () => <div className="font-semibold text-sm text-center">Size</div>,
        cell: ( info ) =>
        {
            const size = info.getValue() as string;

            // Handle case where alternative code might be empty or null
            if ( !size )
            {
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <Badge variant="outline" className="text-muted-foreground">
                            Không có
                        </Badge>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-2 text-sm justify-center">
                    <Badge variant="secondary" className="font-mono text-sm">
                        { size }
                    </Badge>
                </div>
            );
        },
    }

];

export const productPriceColumns = (
    onShowDetailPrice: ( storeProductId: string ) => void,
    onShowPriceHistory: ( productVariantId: string ) => void,
): ColumnDef<TStoreProduct>[] => [
        {
            id: "productImage",
            header: () => <div className="font-semibold text-sm">Ảnh</div>,
            cell: ( { row } ) =>
            {
                const productImageUrl = row.original.productVariant.imageUrl;

                return (
                    <div className="flex items-center gap-2">
                        { productImageUrl ? (
                            <PhotoProvider>
                                <PhotoView src={ productImageUrl }>

                                    <img
                                        src={ productImageUrl }
                                        alt={ "Ảnh sản phẩm" }
                                        className="w-10 h-10 object-cover rounded hover:cursor-pointer"
                                    />
                                </PhotoView>
                            </PhotoProvider>
                        ) : (
                            <Badge variant="outline" className="text-sm font-normal">
                                N/A
                            </Badge>
                        ) }
                    </div>
                );
            },
            size: 80, // Fixed width for consistent layout
        },
        {
            id: "code",
            header: () => <div className="font-semibold text-sm">Mã sản phẩm</div>,
            cell: ( { row } ) =>
            {
                const code = row.original.productVariant.code as string;
                return (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm font-normal">
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
            header: () => <div className="font-semibold text-sm">Mã SKU</div>,
            cell: ( { row } ) =>
            {
                const sku = row.original.productVariant.sku as string;
                return (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm font-normal">
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
            header: () => <div className="font-semibold text-sm">Tên sản phẩm</div>,
            cell: ( { row } ) =>
            {
                const name = row.original.productVariant.name as string;
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
            id: "basePrice",
            header: () => <div className="text-center font-semibold text-sm">Giá gốc</div>,
            cell: ( { row } ) =>
            {
                const price = row.original.productVariant.price as number;
                return (
                    <div className="text-center">
                        <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 hover:bg-green-200 text-sm"
                        >
                            { formatPrice( price ) }
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "overridePrice",
            header: () => <div className="text-center font-semibold text-sm">Giá bán</div>,
            cell: ( info ) =>
            {
                const overridePrice = info.getValue() as number || null;
                // const currenyCode = row.original.currencyCode as string;
                return (
                    <div className="text-center">
                        {
                            overridePrice === null ? (
                                <Badge variant="outline" className="text-sm font-normal">
                                    Chưa cập nhật
                                </Badge>
                            ) : (
                                <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800 hover:bg-green-200 text-sm"
                                >
                                    { formatPrice( overridePrice ) }
                                </Badge>
                            )
                        }
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="text-center font-semibold text-sm">Thao Tác</div>
            ),
            cell: ( { row } ) =>
            {
                const productPrice = row.original;
                // const navigate = useNavigate();

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
                                        onShowDetailPrice( productPrice.id )
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                    <span className="text-blue-700">Chỉnh sửa giá bán</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-orange-0 focus:bg-orange-10"
                                    onClick={ () =>
                                        onShowPriceHistory( productPrice.productVariant.id )
                                    }
                                >
                                    <>
                                        <Eye className="mr-2 h-4 w-4 text-orange-600" />
                                        <span className="text-orange-700">Lịch sử thay đổi giá</span>
                                    </>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div >
                );
            },
            size: 80,
        },
    ];

export const storeTaxRateColumns = (
    onEdit: ( id: string ) => void,
): ColumnDef<TStoreTaxRate>[] => [
        {
            accessorKey: "index",
            header: () => <div className="text-center font-semibold">STT</div>,
            cell: ( { row, table } ) =>
            {
                const { pageIndex, pageSize } = table.getState().pagination;
                return <div className="text-center">{ row.index + 1 + pageIndex * pageSize }</div>;
            },
            size: 50,
        },
        {
            accessorKey: "name",
            header: () => <div className="font-semibold text-center">Tên thuế</div>,
            cell: ( { row } ) =>
            {
                const name = row.original.name;
                return <div className="text-center text-blue-700 font-medium">{ name }</div>;
            },
            size: 120,
        },
        {
            accessorKey: "rate",
            header: () => <div className="font-semibold text-center">{ "Tỉ lệ ( % )" }</div>,
            cell: ( { row } ) =>
            {
                const rate = row.original.rate;
                return <div className="text-center text-orange-700 font-medium">{ `${ rate } %` }</div>;
            },
            size: 120,
        },
        {
            accessorKey: "isActive",
            header: () => <div className="text-center font-semibold">Trạng thái</div>,
            cell: ( { row } ) =>
            {
                const isActive = row.original.isActive;
                return (
                    <div className="text-center">
                        { isActive ? (
                            <span className="text-green-600 font-medium">Kích hoạt</span>
                        ) : (
                            <span className="text-red-500 italic">Không kích hoạt</span>
                        ) }
                    </div>
                );
            },
            size: 160,
        },
        {
            accessorKey: "createdDate",
            header: () => <div className="text-center font-semibold">Ngày tạo</div>,
            cell: ( { row } ) =>
            {
                const date = new Date( row.original.createdDate );
                return (
                    <div className="text-center text-sm text-gray-500">
                        { date.toLocaleString( "vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        } ) }
                    </div>
                );
            },
            size: 180,
        },
        {
            id: "actions",
            header: () => <div className="text-center font-semibold">Thao tác</div>,
            cell: ( { row } ) => (
                <div className="flex justify-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={ () => onEdit( row.original.id ) }>
                                    <Edit className="w-4 h-4 hover:text-primary cursor-pointer" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-sm">Chỉnh sửa thuế</div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 80,
        },
    ]

export const storePriceHistoryColumns: ColumnDef<TPriceProductHistory>[] = [
    {
        id: "index",
        header: () => (
            <div className="flex font-semibold text-sm justify-center max-w-[50px]">
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
        header: () => <div className="font-semibold text-base text-center">Thời gian thay đổi</div>,
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
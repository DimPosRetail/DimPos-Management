import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";

export const columns: ColumnDef<TProductVariantResponse>[] = [
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
    },
    {
        id: "quantity",
        header: () =>
        {
            return <div className="text-center font-semibold">Số lượng</div>;
        },
        cell: ( { row, table } ) =>
        {
            const isSelected = row.getIsSelected();
            const { onQuantityChange, quantityValues } =
                table.options.meta || {};

            const product = row.original;

            const currentQuantity =
                quantityValues?.find( ( q ) => q.productVariantId === product.id )
                    ?.quantity || 1;

            return (
                <div className="flex justify-center">
                    <Input
                        type="number"
                        min="1"
                        step="1"
                        className="w-20 text-center"
                        value={ currentQuantity }
                        onChange={ ( e ) =>
                        {
                            const rawValue = e.target.valueAsNumber;
                            if ( isNaN( rawValue ) ) return;
                            const newQuantity = Math.max( 1, Math.floor( rawValue ) );
                            onQuantityChange?.( product.id, newQuantity );
                        } }
                        disabled={ !isSelected }
                        onKeyDown={ ( e ) =>
                        {
                            if ( [ ".", "e", "+", "-" ].includes( e.key ) )
                            {
                                e.preventDefault();
                            }
                            if ( e.key === "Enter" )
                            {
                                e.preventDefault();
                            }
                        } }
                    />
                </div>
            );
        },
        size: 100,
    },
    {
        id: "displayOrder",
        header: () =>
        {
            return <div className="text-center font-semibold">TT Hiển thị</div>;
        },
        cell: ( { row, table } ) =>
        {
            const isSelected = row.getIsSelected();
            const { onDisplayOrderChange, displayOrderValues } =
                table.options.meta || {};

            const product = row.original;

            const currentDisplayOrder =
                displayOrderValues?.find( ( q ) => q.productVariantId === product.id )
                    ?.displayOrder || 0;

            return (
                <div className="flex justify-center">
                    <Input
                        type="number"
                        // Prevent non-integer values and values less than 1
                        min="1"
                        step="1" // Only allow whole number increments
                        className="w-20 text-center"
                        value={ currentDisplayOrder }
                        onChange={ ( e ) =>
                        {
                            // Parse the value as a float first to handle empty input
                            const rawValue = e.target.valueAsNumber;
                            // If the input is empty or NaN, don't trigger an update yet
                            if ( isNaN( rawValue ) ) return;

                            // Ensure it's a positive integer
                            const newDisplayOrder = Math.max( 1, Math.floor( rawValue ) );
                            onDisplayOrderChange?.( product.id, newDisplayOrder );
                        } }
                        disabled={ !isSelected }
                        onKeyDown={ ( e ) =>
                        {
                            // Prevent typing decimals, 'e', '+', '-'
                            if ( [ ".", "e", "+", "-" ].includes( e.key ) )
                            {
                                e.preventDefault();
                            }
                            if ( e.key === "Enter" )
                            {
                                e.preventDefault();
                            }
                        } }
                    />
                </div>
            );
        },
        size: 100,
    },
];
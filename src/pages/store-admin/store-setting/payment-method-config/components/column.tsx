import ImageNotFound from "@/assets/illustration/image-not-found";
import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard, formatDate } from "@/lib/utils";
import type { TSystemPaymentMethod } from "@/schema/payment-method-config.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";

export const columns: ColumnDef<TSystemPaymentMethod>[] = [
    {
        id: "select",
        header: ( { table } ) => <RowSelectHeader table={ table } />,
        cell: ( { row } ) => <RowSelectCell row={ row } />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "logoUrl",
        header: () => <div className="text-center font-semibold text-sm">Logo</div>,
        cell: ( { getValue } ) =>
        {
            const url = getValue() as string;

            return (
                <div className="flex justify-center items-center w-12 h-12 mx-auto">
                    { url ? (
                        <img
                            src={ url }
                            alt="Logo"
                            className="w-10 h-10 object-cover rounded-md border"
                        />
                    ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 overflow-hidden border">
                            <ImageNotFound />
                        </div>
                    ) }
                </div>
            );
        },
        size: 80,
    },
    {
        accessorKey: "code",
        header: "Mã",
        cell: ( { getValue } ) =>
        {
            const code = getValue() as string;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{ code }</Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={ () => copyToClipboard( code, "Mã phương thức" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Tên phương thức",
        cell: ( { getValue } ) =>
        {
            const name = getValue() as string;
            return (
                <div className="max-w-[200px] truncate text-base font-medium">{ name }</div>
            );
        },
    },
    {
        accessorKey: "isGloballyActive",
        header: "Trạng thái",
        cell: ( { getValue } ) =>
        {
            const active = getValue() as boolean;
            return (
                <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-sm font-medium whitespace-nowrap max-w-[120px] text-center"
                    style={ {
                        backgroundColor: active ? "#E6F9F0" : "#FFEAEA",
                        color: active ? "#12B76A" : "#F04438",
                    } }
                >
                    { active ? "Đang hoạt động" : "Không hoạt động" }
                </div>
            );
        },
    },
    {
        header: "Ngày cập nhật",
        cell: ( { row } ) =>
        {
            const { createdDate, lastModifiedDate } = row.original;
            const dateToDisplay = lastModifiedDate || createdDate;

            return (
                <div className="text-sm text-muted-foreground italic">
                    { formatDate( dateToDisplay ) }
                </div>
            );
        },
    },
];

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import type { TStore } from "@/schema/store.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Mail, MapPin, Phone } from "lucide-react";

export const columns: ColumnDef<TStore>[] = [
    {
        accessorKey: "code",
        header: () => (
            <div className="font-semibold text-base">
                Mã Cửa Hàng
            </div>
        ),
        cell: ( info ) =>
        {
            const code = info.getValue() as string;
            return (
                <div className="max-w-[200px]">
                    <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-base">
                        { code }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: () => (
            <div className="font-semibold text-base">
                Tên Cửa Hàng
            </div>
        ),
        cell: ( info ) =>
        {
            const name = info.getValue() as string;
            return (
                <div className="max-w-[200px]">
                    <div className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors text-base">
                        { name }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "address",
        header: () => (
            <div className="font-semibold text-base">
                Địa Chỉ
            </div>
        ),
        cell: ( info ) =>
        {
            const address = info.getValue() as string;
            const row = info.row.original;
            const hasCoordinates = row.latitude && row.longitude;

            return (
                <div className="max-w-[250px]">
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="text-foreground truncate text-base" title={ address }>
                                { address }
                            </div>
                            { hasCoordinates && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                    Có tọa độ
                                </Badge>
                            ) }
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "phone",
        header: () => (
            <div className="font-semibold text-base">
                Số Điện Thoại
            </div>
        ),
        cell: ( info ) =>
        {
            const phone = info.getValue() as string;

            if ( !phone )
            {
                return (
                    <Badge variant="outline" className="text-muted-foreground text-base">
                        Chưa có
                    </Badge>
                );
            }

            return (
                <div className="flex items-center gap-2 max-w-[140px]">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                        <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate" title={ phone }>{ phone }</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
                        onClick={ () => copyToClipboard( phone, "Số điện thoại" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: () => (
            <div className="font-semibold text-base">
                Email
            </div>
        ),
        cell: ( info ) =>
        {
            const email = info.getValue() as string;

            if ( !email )
            {
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Chưa có
                    </Badge>
                );
            }

            return (
                <div className="flex items-center gap-2 max-w-[200px]">
                    <div className="flex items-center gap-1 flex-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate">{ email }</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
                        onClick={ () => copyToClipboard( email, "Email" ) }
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
];
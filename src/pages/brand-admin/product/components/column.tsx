import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import type { TModifierGroupResponse } from "@/schema/product.schema";
import type { ColumnDef } from "@tanstack/react-table";

export const modifierColumns: ColumnDef<TModifierGroupResponse>[] = [
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
        accessorKey: "name",
        header: () => <div className="font-semibold text-base">Tên tùy chọn</div>,
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
        accessorKey: "description",
        header: () => <div className="font-semibold text-base">Mô Tả</div>,
        cell: ( info ) =>
        {
            const description = info.getValue() as string;
            return (
                <div className="max-w-[200px]">
                    <div className="font-normal text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors">
                        { description || "Không có mô tả" }
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "selectedType",
        header: () => <div className="font-semibold text-base">Hình thức chọn</div>,
        cell: ( info ) =>
        {
            const selectedType = info.getValue() as number;
            const label =
                selectedType === 0
                    ? "Một"
                    : selectedType === 1
                        ? "Nhiều"
                        : "Không xác định";

            return (
                <div className="font-normal text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors">
                    { label }
                </div>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: () => (
            <div className="text-center font-semibold text-base ">Trạng Thái</div>
        ),
        cell: ( info ) =>
        {
            const status = info.getValue() as boolean;

            return (
                <div className="flex justify-center">
                    <div
                        className={ `flex items-center gap-1.5 px-3 py-1 rounded text-sm ${ status ? "bg-green-mint-10 text-green-mint-100" : "bg-red-10 text-red-100"
                            }` }
                    >
                        { status ? <>Hiển thị</> : <>Ẩn</> }
                    </div>
                </div>
            );
        },
    },
];


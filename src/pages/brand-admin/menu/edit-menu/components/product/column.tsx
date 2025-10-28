import { RowSelectCell, RowSelectHeader } from "@/components/table/row-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import type { TProductVariantResponse } from "@/schema/product-variant.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export const columns: ColumnDef<TProductVariantResponse>[] = [
  {
    accessorKey: "productImages",
    header: () => <div className="font-semibold text-sm">Ảnh</div>,
    cell: ( info ) =>
    {
      const productImages = info.getValue() as TProductVariantResponse[ "productImages" ];
      const mainImage = productImages?.find( img => img.isMainImage );

      return (
        <div className="flex items-center gap-2">
          { mainImage ? (
            <PhotoProvider>
              <PhotoView src={ mainImage.imageUrl }>

                <img
                  src={ mainImage.imageUrl }

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
    }
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
    accessorKey: "price",
    header: () => <div className="text-center font-semibold text-sm">Giá gốc</div>,
    cell: ( info ) =>
    {
      const price = info.getValue() as number;
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
    accessorKey: "isActive",
    header: () => <div className="text-center font-semibold text-sm">Trạng thái</div>,
    cell: ( info ) =>
    {
      const isActive = info.getValue() as number;
      // const isActive = status === 0;

      return (
        <div className="flex justify-center">
          <div
            // variant={ isVisible ? "default" : "secondary" }
            className={ `flex items-center gap-1.5 px-3 py-1 rounded text-sm ${ isActive
              ? "bg-green-mint-10 text-green-mint-100"
              : "bg-neutral-10 text-neutral-100 "
              }` }
          >
            {/* Status indicator with both visual and text cues */ }
            { isActive ? <>Hoạt động</> : <>Không hoạt động</> }
          </div>
        </div>
      );
    },
  },
];

export const selectColumns: ColumnDef<TProductVariantResponse>[] = [
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
            variant="ghost"
            type="button"
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
    accessorKey: "price",
    header: () => <div className="text-center font-semibold text-sm">Giá bán</div>,
    cell: ( info ) =>
    {
      const price = info.getValue() as number;
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
    accessorKey: "isActive",
    header: () => <div className="text-center font-semibold text-sm">Trạng thái</div>,
    cell: ( info ) =>
    {
      const isActive = info.getValue() as boolean;

      return (
        <div className="flex justify-center">
          <div
            // variant={ isVisible ? "default" : "secondary" }
            className={ `flex items-center gap-1.5 px-3 py-1 rounded text-sm ${ isActive
              ? "bg-green-mint-10 text-green-mint-100"
              : "bg-neutral-10 text-neutral-100 "
              }` }
          >
            {/* Status indicator with both visual and text cues */ }
            { isActive ? <>Hoạt động</> : <>Không hoạt động</> }
          </div>
        </div>
      );
    },
  },
];
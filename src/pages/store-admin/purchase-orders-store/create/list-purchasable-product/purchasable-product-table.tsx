import { DataTable, type TProductQuantity } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import
{
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useInternalProduct } from "@/hooks/use-internal-product";
import { useInternalPurchaseOrders } from "@/hooks/use-internal-purchase-order";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { CreateInternalOrderSchema, type TCreateInternalOrder, type TCreateInternalOrderRequest, type TCreateStoreOrderItem } from "@/schema/internal-purchase-orders.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { columns } from "./components/columns";
import { DialogTrigger } from "@radix-ui/react-dialog";

type Props = {
  children: ReactNode;
};

const SelectInternalProductModal = ( {
  children,
}: Props ) =>
{
  const [ open, setOpen ] = useState( false );
  const [ step, setStep ] = useState( 1 );
  const { getInternalProducts } = useInternalProduct();
  const { createInternalPurchaseOrderMutation } = useInternalPurchaseOrders();
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setPage,
    setPageSize,
    filter,
    setFilter,
    resetParams,
  } = useQueryParams( {
    defaultSortBy: "name",
    defaultFilter: [
      {
        id: "name",
        value: "",
      },
      {
        id: "sku",
        value: "",
      },
    ],
  } );

  const { data, isError, error, isLoading } = getInternalProducts( {
    size: pageSize,
    page: currentPage,
    name: filter.find( ( f ) => f.id === "name" )?.value as string || "",
    sku: filter.find( ( f ) => f.id === "sku" )?.value as string || null,
    sortBy: sortBy,
    isAsc: isAsc,
  } );

  if ( isError && error )
  {
    handleApiError( error );
  }

  const items = data?.data.data.items || [];
  const total = data?.data.data.total || 0;

  const form = useForm<TCreateInternalOrder>( {
    resolver: zodResolver( CreateInternalOrderSchema ),
    defaultValues: {
      storePurchaseOrderItems: [],
      note: "",
    },
  } )

  useEffect( () =>
  {
    form.reset();
    resetParams();
  }, [ open, form ] );

  const onSubmit = async ( data: TCreateInternalOrderRequest ) =>
  {
    if ( data.storePurchaseOrderItems.length === 0 )
    {
      toast.warning( "Vui lòng chọn ít nhất một sản phẩm" );
      return;
    }
    if ( data.storePurchaseOrderItems.some( item => item.requestedQuantity <= 0 ) )
    {
      toast.warning( "Số lượng sản phẩm phải lớn hơn 0" );
      return;
    }
    try
    {
      await createInternalPurchaseOrderMutation.mutateAsync( {
        storePurchaseOrderItems: data.storePurchaseOrderItems.map( item => ( {
          productVariantId: item.productVariantId,
          requestedQuantity: item.requestedQuantity,
        } ) ),
        note: data.note || "",
      } as TCreateInternalOrderRequest );
      toast.success( "Tạo đơn hàng nội bộ thành công" );
      setStep( 1 );
      form.reset();
    } catch ( err )
    {
      handleApiError( err );
    }
  };
  const searchValues = filter.map( ( f ) => ( {
    ...f,
    searchPlaceholder:
      f.id === "name"
        ? "Tìm kiếm theo tên"
        : f.id === "sku"
          ? "Tìm kiếm theo mã SKU"
          : "",
  } ) );
  const handleQuantityChange = ( productVariantId: string, quantity: number ) =>
  {
    const currentValue = form.getValues( "storePurchaseOrderItems" );
    const updatedValue = currentValue.map( item =>
    {
      if ( item.productVariantId === productVariantId )
      {
        return { ...item, requestedQuantity: quantity };
      }
      return item;
    } );
    form.setValue( "storePurchaseOrderItems", updatedValue );
  }

  const quantityValues = useMemo( (): TProductQuantity[] =>
  {
    const value = form.watch( "storePurchaseOrderItems" );
    return ( value as TCreateStoreOrderItem[] ).map( item => ( {
      productVariantId: item.productVariantId,
      quantity: item.requestedQuantity || 1,
    } ) );
  }, [ form.watch( "storePurchaseOrderItems" ) ] );

  const handleRowSelectionChange = (
    newSelection: Record<string, boolean>,
    oldSelection: Record<string, boolean>
  ) =>
  {
    const currentItems = form.getValues( "storePurchaseOrderItems" ) as TCreateStoreOrderItem[];
    const currentProductVariantIds = currentItems.map( variant => variant.productVariantId );

    const newlySelected = Object.entries( newSelection )
      .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
      .map( ( [ rowId ] ) => rowId );

    const newlyDeselected = Object.entries( oldSelection )
      .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
      .map( ( [ rowId ] ) => rowId );

    let updatedIds = [ ...currentProductVariantIds ];

    newlySelected.forEach( id =>
    {
      if ( !updatedIds.includes( id ) )
      {
        updatedIds.push( id );
      }
    } );

    updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

    const storePurchaseOrderItems = updatedIds.map( id =>
    {
      const productVariant = items.find( item => item.id === id );
      // Keep old requestedQuantity if exists, otherwise default to 1
      const existing = currentItems.find( item => item.productVariantId === id );
      return {
        id: productVariant?.id || existing?.id,
        name: productVariant?.name || existing?.name,
        sku: productVariant?.sku || existing?.sku,
        code: productVariant?.code || existing?.code,
        price: productVariant?.price || existing?.price,
        productImages: productVariant?.productImages || existing?.productImages,
        productVariantId: productVariant?.id || existing?.id,
        requestedQuantity: existing ? existing.requestedQuantity : 1,
      };
    } ).filter( item => item !== null ) as TCreateStoreOrderItem[];
    form.setValue( "storePurchaseOrderItems", storePurchaseOrderItems );
  }

  return (
    <Dialog open={ open } onOpenChange={ (isOpen) => { setOpen(isOpen); setStep(1); } }>
      <DialogTrigger asChild>
        { children }
      </DialogTrigger>
      <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] xl:min-w-[1400px] overflow-x-scroll rounded-3xl [&>button]:hidden">
        <Form { ...form } >
          <form onSubmit={ form.handleSubmit( onSubmit ) } noValidate className="w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold mb-4">
                Chọn sản phẩm cho đơn hàng nội bộ
              </DialogTitle>
            </DialogHeader>

            <div className="my-4 max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1400px]">
              <DataTable
                // isShort={ step === 2 }
                data={ step === 2 ? form.watch( "storePurchaseOrderItems" ) as any[] : items }
                totalItems={ step === 2 ? ( form.watch( "storePurchaseOrderItems" ) as any[] ).length : total }
                columns={ columns( step ) }
                currentPage={ currentPage }
                pageSize={ pageSize }
                isLoading={ isLoading }
                isShort={ step === 2 }
                onPageChange={ step === 2 ? () => { } : setPage }
                onPageSizeChange={ step === 2 ? () => { } : setPageSize }
                searchValues={ step === 2 ? undefined : searchValues }
                onSearchChange={ step === 2 ? undefined : setFilter }
                isPagingProp={ step === 1 }
                meta={ {
                  onQuantityChange: handleQuantityChange,
                  quantityValues: quantityValues,
                } }
                rowSelection={ step === 2 ? undefined : items.reduce<Record<string, boolean>>( ( acc, item ) =>
                {
                  acc[ item.id ] = ( form.watch( "storePurchaseOrderItems" ) as TCreateStoreOrderItem[] ).map( variant => variant.productVariantId ).includes( item.id );
                  return acc;
                }, {} ) }
                onRowSelectionChange={ step === 2 ? undefined : handleRowSelectionChange }
              />
            </div>
            { step === 2 && <div className="flex justify-end items-center my-4 font-semibold text-lg">
              Tổng đơn hàng: { formatPrice( form.watch( "storePurchaseOrderItems" ).reduce( ( total, item ) => total + ( item.requestedQuantity || 1 ) * ( item.price || 0 ), 0 ) ) }
            </div> }
            { step === 2 && <FormField
              control={ form.control }
              name="note"
              render={ ( { field } ) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-xl my-2">Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={ createInternalPurchaseOrderMutation.isPending }
                      className="w-full p-2 border rounded-md bg-white"
                      placeholder="Nhập ghi chú cho đơn hàng"
                      { ...field }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            /> }
            <DialogFooter>
              <Button type="button" variant="outline" onClick={ () =>
              {
                setStep( 1 );
                form.reset();
                setOpen( false );
              } }>Hủy</Button>
              { step === 2 && <Button type="button" variant="ghost" className="text-primary" disabled={ createInternalPurchaseOrderMutation.isPending } onClick={ () => setStep( 1 ) }>
                Quay lại
              </Button> }
              { step === 1 && <Button type="button" disabled={ createInternalPurchaseOrderMutation.isPending || ( form.watch( "storePurchaseOrderItems" ).length === 0 ) } onClick={ () => setStep( 2 ) }> Tiếp tục</Button> }
              { step === 2 && <Button type="button" disabled={ createInternalPurchaseOrderMutation.isPending } onClick={ form.handleSubmit( onSubmit ) }>
                Tạo đơn hàng
              </Button> }
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  );
};

export default SelectInternalProductModal;

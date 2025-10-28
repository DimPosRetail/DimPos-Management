import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useProduct } from "@/hooks/use-product";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { UpdateModifierGroupProductSchema, type TModifierGroupResponse, type TUpdateModifierGroupProductRequest } from "@/schema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { modifierColumns } from "../../components/column";
import { toast } from "sonner";

type Props = {
    // initialData: TProductModifierOptionRequest;
    productId: string;
    initialData?: TModifierGroupResponse[];
}

const ModifierGroupForm = ( {
    productId,
    initialData = []
}: Props ) =>
{
    const form = useForm<TUpdateModifierGroupProductRequest>( {
        resolver: zodResolver( UpdateModifierGroupProductSchema ),
        defaultValues: {
            modifierGroupIds: initialData.map( ( item ) => item.id ),
        },
    } );
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
    } = useQueryParams();

    const { getModifierGroups, updateModifierGroupsIntoProductMutation } = useProduct();
    const { data, isLoading, isError, error } = getModifierGroups( {
        size: pageSize,
        page: currentPage,
        sortBy,
        isAsc,
    } );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    };
    const onSubmit = async ( data: TUpdateModifierGroupProductRequest ) =>
    {
        console.log( "Submitted data:", data );
        try
        {
            await updateModifierGroupsIntoProductMutation.mutateAsync( {
                id: productId,
                data: data,
            } );
            toast.success( "Cập nhật tùy chọn thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        oldSelection: Record<string, boolean>
    ) =>
    {
        const currentModifierGroupIds = form.getValues( "modifierGroupIds" ) as string[];

        // Tìm những row được selected và deselected
        const newlySelected = Object.entries( newSelection )
            .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        const newlyDeselected = Object.entries( oldSelection )
            .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        //console.log( "Newly selected:", newlySelected );
        //console.log( "Newly deselected:", newlyDeselected );

        // Cập nhật form value
        let updatedIds = [ ...currentModifierGroupIds ];

        // Thêm những item được select
        newlySelected.forEach( id =>
        {
            if ( !updatedIds.includes( id ) )
            {
                updatedIds.push( id );
            }
        } );

        // Xóa những item được deselect
        updatedIds = updatedIds.filter( id => !newlyDeselected.includes( id ) );

        // Set form value
        form.setValue( "modifierGroupIds", updatedIds );

        //console.log( "Updated productVariantIds:", updatedIds );
    }

    return (
        <Form { ...form }>
            <form onSubmit={ form.handleSubmit( onSubmit ) }>
                <div className="relative">
                    <Card className='shadow-none border-none bg-white h-fit gap-2'>
                        <CardHeader>
                            <CardTitle>Tùy chọn sản phẩm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={ modifierColumns }
                                data={ items }
                                totalItems={ total }
                                currentPage={ currentPage }
                                pageSize={ pageSize }
                                onPageChange={ setPage }
                                onPageSizeChange={ setPageSize }
                                isLoading={ isLoading }
                                sortValues={ [ sortValue ] }
                                onSortChange={ ( newSort ) =>
                                {
                                    setSort( newSort[ 0 ].id, !newSort[ 0 ].desc );
                                } }
                                rowSelection={
                                    items.reduce<Record<string, boolean>>( ( acc, item ) =>
                                    {
                                        acc[ item.id ] = ( form.watch( "modifierGroupIds" ) as string[] ).includes( item.id );
                                        return acc;
                                    }, {} )
                                }
                                onRowSelectionChange={ handleRowSelectionChange }
                            />
                        </CardContent>
                    </Card>
                    <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                        <Button className='mr-8 py-5 px-10' type="submit" disabled={ updateModifierGroupsIntoProductMutation.isPending || ( form.watch( "modifierGroupIds" ) as string[] ).length === ( initialData.map( ( item ) => item.id ) ).length &&
                            JSON.stringify( [ ...( form.watch( "modifierGroupIds" ) as string[] ) ].sort() ) === JSON.stringify( [ ...( initialData.map( ( item ) => item.id ) ) ].sort() ) }>
                            Lưu
                        </Button>
                    </div>
                </div>

            </form>
        </Form>
    )
}

export default ModifierGroupForm
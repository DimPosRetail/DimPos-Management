import { DataTable } from '@/components/table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductVariant } from '@/hooks/use-product-variant';
import { useQueryParams } from '@/hooks/use-query-params';
import { handleApiError } from '@/lib/error';
import { columns } from './column';
import { useState } from 'react';
import type { TRecipeItemResponse } from '@/schema/product-variant.schema';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import ConfirmDialog from '@/components/dialog/confirm-dialog';
import { handleChangeModalState } from '@/redux/modal/modal-slice';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CircleArrowOutUpRight } from 'lucide-react';
import EditRecipeItemDialog from './edit-quantity-recipe-item-dialog';
import AddRecipeItemDialog from './add-recipe-item-dialog';

type Props = {
    productVariantId: string;
}

const RecipeSection = ( {
    productVariantId
}: Props ) =>
{
    const { isOpen } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { deleteRecipeItemMutation } = useProductVariant();
    const {
        currentPage,
        pageSize,
        sortBy,
        isAsc,
        setSort,
        setPage,
        setPageSize,
    } = useQueryParams();

    const { getRecipeItemsByProductVariantId } = useProductVariant();
    const { data, isLoading, isError, error } = getRecipeItemsByProductVariantId( productVariantId, {
        size: pageSize,
        page: currentPage,
        sortBy: sortBy,
        isAsc: isAsc,
    } );
    //console.log( "ProductTable data:", data?.data.data.items, " isLoading:", isLoading );

    if ( isError && error )
    {
        handleApiError( error );
    }

    const items = data?.data.data.items || [];
    const total = data?.data.data.total || 0;

    const sortValue = {
        id: sortBy,
        desc: !isAsc,
    }
    const [ recipeItem, setRecipeItem ] = useState<TRecipeItemResponse | null>( null );
    const [ recipeItemId, setRecipeItemId ] = useState<string | null>( null );
    const handleConfirmSubmit = async () =>
    {
        if ( total === 1 )
        {
            toast.error( "Không thể xóa thành phần cuối cùng trong công thức" );
            return;
        }
        if ( recipeItemId )
        {
            try
            {
                await deleteRecipeItemMutation.mutateAsync( {
                    productVariantId: productVariantId,
                    recipeItemId: recipeItemId,
                } );
                queryClient.invalidateQueries( { queryKey: [ "recipeItems", productVariantId ] } );
                setRecipeItemId( null );
                toast.success( "Xóa thành phần thành công" );
            } catch ( error )
            {
                handleApiError( error );
            }
        }
    }

    return (
        <Card className='shadow-none border-none bg-white gap-1'>
            <ConfirmDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Xác nhận xóa thành phần"
                description="Bạn có chắc chắn muốn xóa thành phần trong công thức này không?"
                actionLabel="Xác nhận"
                onAction={ handleConfirmSubmit }
            />
            <EditRecipeItemDialog
                initialData={ recipeItem }
                isOpen={ !!recipeItem }
                onOpenChange={ ( open ) => setRecipeItem( open ? recipeItem : null ) }
                productVariantId={ productVariantId }
            />
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>
                    Danh sách các thành phần cho công thức
                </CardTitle>
                <AddRecipeItemDialog
                    productVariantId={ productVariantId }
                    existedIngredientIds={ items.map( item => item.ingredient.id ) }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button">
                        Thêm thành phần
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </AddRecipeItemDialog>
            </CardHeader>
            <CardContent>
                <DataTable
                    isShort
                    columns={
                        columns(
                            ( recipeItem: TRecipeItemResponse ) => setRecipeItem( recipeItem ),
                            ( recipeItemId: string ) =>
                            {
                                setRecipeItemId( recipeItemId );
                                dispatch( handleChangeModalState( true ) );
                            }
                        )
                    }
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
                />
            </CardContent>
        </Card>
    )
}

export default RecipeSection
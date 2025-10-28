import { Button } from "@/components/ui/button";
import
    {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
    } from "@/components/ui/dialog";
import
    {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
    } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { UpdateStoreTaxRateRequestSchema, type TStoreTaxRate, type TUpdateStoreTaxRateRequest } from "@/schema/store.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    storeId: string;
    taxRate: TStoreTaxRate;
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
}

const EditStoreTaxRateDialog = ( {
    storeId,
    taxRate,
    open,
    onOpenChange,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const { updateStoreTaxRateMutation } = useStore();
    const form = useForm<TUpdateStoreTaxRateRequest>( {
        resolver: zodResolver( UpdateStoreTaxRateRequestSchema ),
        defaultValues: {
            name: taxRate.name,
            rate: taxRate.rate,
            isActive: taxRate.isActive,
        }
    } );

    useEffect( () =>
    {
        if ( open )
        {
            form.reset( {
                name: taxRate.name,
                rate: taxRate.rate,
                isActive: taxRate.isActive,
            } );
        }
    }, [ open, taxRate, form ] );

    const onSubmit = async ( data: TUpdateStoreTaxRateRequest ) =>
    {
        try
        {
            await updateStoreTaxRateMutation.mutateAsync( {
                storeId,
                taxRateId: taxRate.id,
                data
            } );
            queryClient.invalidateQueries( {
                queryKey: [ "store-tax-rates", storeId ]
            } );
            toast.success( "Cập nhật thuế cửa hàng thành công!" );
            onOpenChange( false );
        } catch ( error )
        {
            handleApiError( error );
        }
    };

    const handleOpenChange = ( newOpen: boolean ) =>
    {
        onOpenChange( newOpen );
        if ( !newOpen )
        {
            form.reset();
        }
    };

    return (
        <Dialog open={ open } onOpenChange={ handleOpenChange }>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thuế cửa hàng</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin thuế cho cửa hàng. Thay đổi tên, tỷ lệ thuế hoặc trạng thái hoạt động.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-4">
                        <FormField
                            control={ form.control }
                            name="name"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Tên thuế</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên thuế..."
                                            { ...field }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="rate"
                            render={ ( { field } ) => (
                                <FormItem>
                                    <FormLabel>Tỷ lệ thuế (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            placeholder="Nhập tỷ lệ thuế..."
                                            { ...field }
                                            onChange={ ( e ) => field.onChange( parseFloat( e.target.value ) || 0 ) }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={ form.control }
                            name="isActive"
                            render={ ( { field } ) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Trạng thái hoạt động
                                        </FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Bật/tắt thuế này cho cửa hàng
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={ field.value }
                                            onCheckedChange={ field.onChange }
                                        />
                                    </FormControl>
                                </FormItem>
                            ) }
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={ () => onOpenChange( false ) }
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={ updateStoreTaxRateMutation.isPending }
                            >
                                { updateStoreTaxRateMutation.isPending ? "Đang cập nhật..." : "Cập nhật" }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStoreTaxRateDialog;

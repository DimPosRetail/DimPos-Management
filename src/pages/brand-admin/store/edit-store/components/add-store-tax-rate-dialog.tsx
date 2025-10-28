import { Button } from "@/components/ui/button";
import
{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { AddStoreTaxRateRequestSchema, type TAddStoreTaxRateRequest } from "@/schema/store.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
    storeId: string;
    children: ReactNode;
}

const AddStoreTaxRateDialog = ( {
    storeId,
    children,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const [ open, setOpen ] = useState( false );
    const { addStoreTaxRateMutation } = useStore();
    const form = useForm<TAddStoreTaxRateRequest>( {
        resolver: zodResolver( AddStoreTaxRateRequestSchema ),
        defaultValues: {
            name: "",
            rate: 0,
        }
    } )

    useEffect( () =>
    {
        form.reset();
    }, [ open, form ] );

    const onSubmit = async ( data: TAddStoreTaxRateRequest ) =>
    {
        try
        {
            await addStoreTaxRateMutation.mutateAsync( { storeId, data } );
            queryClient.invalidateQueries( {
                queryKey: [ "store-tax-rates", storeId ]
            } );
            toast.success( "Thêm thuế cửa hàng thành công!" );
            setOpen( false );
            form.reset();
        } catch ( error )
        {
            handleApiError( error );
        }
    }



    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm thuế cửa hàng</DialogTitle>
                    <DialogDescription>
                        Thêm mức thuế mới cho cửa hàng. Nhập tên và tỷ lệ thuế.
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
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={ () => setOpen( false ) }
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={ addStoreTaxRateMutation.isPending }
                            >
                                { addStoreTaxRateMutation.isPending ? "Đang thêm..." : "Thêm thuế" }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStoreTaxRateDialog
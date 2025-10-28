import { useState, type ReactNode } from "react";
import { useProduct } from '../../../../../hooks/use-product';
import { useForm } from "react-hook-form";
import { type TUpdateModifierOptionRequest, UpdateModifierOptionSchema } from "@/schema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Props = {
    modifierGroupId: string;
    children: ReactNode;
}

const AddOptionDialog = ( {
    modifierGroupId,
    children,
}: Props ) =>
{
    const queryClient = useQueryClient();
    const [ open, setOpen ] = useState( false );
    const { createModifierOptionMutation } = useProduct();
    const form = useForm<TUpdateModifierOptionRequest>( {
        resolver: zodResolver( UpdateModifierOptionSchema ),
        defaultValues: {
            isActive: true,
        }
    } );

    const onSubmit = async ( data: TUpdateModifierOptionRequest ) =>
    {
        try
        {
            await createModifierOptionMutation.mutateAsync( { groupId: modifierGroupId, data } );
            queryClient.invalidateQueries( { queryKey: [ "modifier-group", modifierGroupId ] } );
            toast.success( "Thêm tùy chọn thành công!" );
            setOpen( false );
        } catch ( error )
        {
            handleApiError( error );
        }
    };
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent className="sm:min-w-[600px] md:min-w-[700px] lg:min-w-[1000px] overflow-x-scroll rounded-3xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>Thêm tùy chọn</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin tùy chọn mới để thêm vào nhóm tùy chọn.
                    </DialogDescription>
                </DialogHeader>
                <Form { ...form } >
                    <form onSubmit={ form.handleSubmit( onSubmit, ( errors ) =>
                    {
                        console.error( "Form validation errors:", errors );
                    } ) } noValidate>
                        <div className='grid grid-cols-1 gap-4'>

                            <FormField
                                control={ form.control }
                                name="name"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Tên tùy chọn *</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ createModifierOptionMutation.isPending }
                                                type="text"
                                                placeholder="Nhập tên tùy chọn"
                                                { ...field }
                                                className="w-full p-2 border rounded"
                                            />
                                        </FormControl>
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="description"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={ createModifierOptionMutation.isPending }
                                                type="text"
                                                placeholder="Nhập mô tả"
                                                { ...field }
                                                className="w-full p-2 border rounded"
                                            />
                                        </FormControl>
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="isActive"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Trạng thái</FormLabel>
                                        <FormControl>
                                            <Switch
                                                disabled={ createModifierOptionMutation.isPending }
                                                checked={ field.value }
                                                onCheckedChange={ field.onChange }
                                            />
                                        </FormControl>
                                    </FormItem>
                                ) }
                            />
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={ () => setOpen( false ) }>Hủy</Button>
                            <Button type="submit" disabled={ createModifierOptionMutation.isPending }>Lưu</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddOptionDialog
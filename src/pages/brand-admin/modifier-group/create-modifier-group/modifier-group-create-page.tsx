import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import
{
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import
{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { productApi } from "@/apis/product.api";
import { handleApiError } from "@/lib/error";
import
{
    CreateModifierGroupSchema,
    type TCreateModifierGroupRequest,
} from "@/schema/product.schema";

const CreateModifierGroupPage = () =>
{

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<TCreateModifierGroupRequest>( {
        resolver: zodResolver( CreateModifierGroupSchema ),
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
            modifierOptions: [
                { name: undefined, description: undefined, isActive: true },
            ],
        },
    } );

    const { fields, append, remove } = useFieldArray( {
        control,
        name: "modifierOptions",
    } );

    const createModifierGroupMutation = useMutation( {
        mutationFn: productApi.createModifierGroup,
    } );

    const onSubmit = async ( data: TCreateModifierGroupRequest ) =>
    {
        try
        {
            await createModifierGroupMutation.mutateAsync( data );
            toast.success( "Tạo nhóm tùy chọn thành công!" );
            // navigate( "/dashboard/modifier-groups" );
        } catch ( error )
        {
            handleApiError( error );
        }
    };

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-6">Tạo Nhóm Tùy Chọn</h1>
            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-6">
                <Card className="w-full shadow-none bg-white border-none">
                    <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <CardTitle>Thông Tin Chung</CardTitle>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <span className="text-sm font-medium">Hiển thị</span>
                            <Controller
                                control={ control }
                                name="isActive"
                                render={ ( { field } ) => (
                                    <Switch
                                        checked={ field.value }
                                        onCheckedChange={ ( val ) => field.onChange( val ) }
                                    />
                                ) }
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên nhóm *</label>
                                <Input
                                    { ...register( "name" ) }
                                    placeholder="Nhập tên nhóm tùy chọn"
                                />
                                { errors.name && <p className="text-sm text-red-500">{ errors.name.message }</p> }
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Hình thức chọn *</label>
                                <Controller
                                    control={ control }
                                    name="selectedType"
                                    render={ ( { field } ) => (
                                        <Select
                                            onValueChange={ ( val ) => field.onChange( Number( val ) ) }
                                            defaultValue={ field.value?.toString() }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn hình thức" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Một</SelectItem>
                                                <SelectItem value="1">Nhiều</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) }
                                />
                                { errors.selectedType && (
                                    <p className="text-sm text-red-500">{ errors.selectedType.message }</p>
                                ) }
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự hiển thị *</label>
                                <Controller
                                    control={ control }
                                    name="displayOrder"
                                    render={ ( { field } ) =>
                                        <Input
                                            type="number"
                                            placeholder="Nhập thứ tự hiển thị"
                                            { ...field }
                                            onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                        />
                                    }

                                />
                                { errors.displayOrder && (
                                    <p className="text-sm text-red-500">{ errors.displayOrder.message }</p>
                                ) }
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <Textarea
                                    { ...register( "description" ) }
                                    placeholder="Nhập mô tả (tùy chọn)"
                                />
                                { errors.description && (
                                    <p className="text-sm text-red-500">{ errors.description.message }</p>
                                ) }
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-full shadow-none bg-white border-none">
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Danh Sách Tùy Chọn</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={ () =>
                                append( {
                                    name: "",
                                    description: "",
                                    isActive: true,
                                } )
                            }
                        >
                            Thêm tùy chọn
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        { fields.map( ( field, index ) => (
                            <Card key={ field.id } className="p-4 border">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                                    <div>
                                        <label className="text-sm font-medium">Tên *</label>
                                        <Input
                                            { ...register( `modifierOptions.${ index }.name` ) }
                                            placeholder="Tên tùy chọn"
                                        />
                                        { errors.modifierOptions?.[ index ]?.name && (
                                            <p className="text-sm text-red-500">
                                                { errors.modifierOptions[ index ]?.name?.message }
                                            </p>
                                        ) }
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Mô tả</label>
                                        <Input
                                            { ...register( `modifierOptions.${ index }.description` ) }
                                            placeholder="Mô tả tùy chọn"
                                        />
                                        { errors.modifierOptions?.[ index ]?.description && (
                                            <p className="text-sm text-red-500">
                                                { errors.modifierOptions[ index ]?.description?.message }
                                            </p>
                                        ) }
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mt-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">Hiển thị</span>
                                            <Controller
                                                control={ control }
                                                name={ `modifierOptions.${ index }.isActive` }
                                                render={ ( { field } ) => (
                                                    <Switch
                                                        checked={ field.value }
                                                        onCheckedChange={ field.onChange }
                                                    />
                                                ) }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={ () => remove( index ) }
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) ) }
                    </CardContent>
                </Card>


                <div className="flex justify-end">
                    <Button type="submit" disabled={ createModifierGroupMutation.isPending }>
                        { createModifierGroupMutation.isPending
                            ? "Đang lưu..."
                            : "Lưu Nhóm Tùy Chọn" }
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateModifierGroupPage;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePromotion } from "@/hooks/use-promotion";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { handleChangeModalState, handleSetCreatedId } from "@/redux/modal/modal-slice";
import type { RootState } from "@/redux/store";
import { CreatePromotionRuleSchema, getActionTypeName, type TCreatePromotionRuleRequest, type TCreateRuleAction, type TCreateRuleCondition } from "@/schema/promotion-rule.schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CircleArrowOutUpRight, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RuleActionDialog from "./components/rule-action-dialog";
import { RuleConditionDialog } from "./components/rule-condition-dialog";
import SuccessDialog from "@/components/dialog/success-dialog";
import { PATH_BRAND_DASHBOARD } from "@/routes/path";

const CreatePromotionPage = () =>
{
    const { isOpen, createdId } = useSelector( ( state: RootState ) => state.modal );
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { createPromotionMutation } = usePromotion();
    const form = useForm<TCreatePromotionRuleRequest>( {
        resolver: zodResolver( CreatePromotionRuleSchema ),
        defaultValues: {
            name: "",
            shortDescription: "",
            description: "",
            priority: 0,
            ruleActions: undefined,
            ruleConditions: []
        }
    } )

    const {
        fields: ruleConditions,
        append: appendCondition,
        remove: removeCondition,
        update: updateCondition,
    } = useFieldArray( {
        control: form.control,
        name: 'ruleConditions',
    } );

    const ruleAction = form.watch( 'ruleActions' );

    const [ isConditionDialogOpen, setIsConditionDialogOpen ] = useState( false );
    const [ isActionDialogOpen, setIsActionDialogOpen ] = useState( false );
    const [ editingConditionIndex, setEditingConditionIndex ] = useState<number | null>( null );

    const handleOpenConditionDialog = ( index?: number ) =>
    {
        setEditingConditionIndex( typeof index === 'number' ? index : null );
        setIsConditionDialogOpen( true );
    };

    const handleSaveCondition = ( data: TCreateRuleCondition ) =>
    {
        if ( editingConditionIndex !== null )
        {
            // We are editing an existing condition
            updateCondition( editingConditionIndex, data );
            toast.success( "Đã cập nhật điều kiện." );
        } else
        {
            // We are adding a new condition
            // Your existing check for duplicates
            const existing = ruleConditions.find( c => c.conditionType === data.conditionType );
            if ( existing )
            {
                toast.warning( "Điều kiện này đã tồn tại. Vui lòng chọn điều kiện khác." );
                return;
            }
            appendCondition( data );
            toast.success( "Đã thêm điều kiện." );
        }
    };

    const handleSaveAction = ( data: TCreateRuleAction ) =>
    {
        form.setValue( "ruleActions", data, { shouldDirty: true } );
        toast.success( ruleAction ? "Đã cập nhật hành động." : "Đã thêm hành động." );
    };

    const onSubmit = async ( data: TCreatePromotionRuleRequest ) =>
    {
        if ( data?.ruleConditions?.length === 0 )
        {
            form.setError( "ruleConditions", {
                type: "manual",
                message: "Vui lòng thêm ít nhất một điều kiện khuyến mãi."
            } );
            return;
        }
        if ( !data.ruleActions )
        {
            form.setError( "ruleActions", {
                type: "manual",
                message: "Vui lòng thêm hành động khuyến mãi trước khi tạo."
            } );
            return;
        }
        console.log( "Submitted data:", data );
        try
        {
            const result = await createPromotionMutation.mutateAsync( data );
            dispatch( handleSetCreatedId( result.data.data ) );
            dispatch( handleChangeModalState( true ) );
            form.reset();
            // toast.success( "Tạo khuyến mãi thành công!" );
        } catch ( error )
        {
            handleApiError( error );
        }
    }
    return (
        <Form { ...form }>
            <SuccessDialog
                open={ isOpen }
                onOpenChange={ ( open ) => dispatch( handleChangeModalState( open ) ) }
                title="Tạo khuyến mãi mới thành công"
                actionLabel="Xem khuyến mãi"
                onAction={ () =>
                {
                    if ( createdId )
                    {
                        dispatch( handleChangeModalState( false ) );
                        navigation( PATH_BRAND_DASHBOARD.promotion.editPromotion( createdId ) );
                    }
                } }
            />
            <form id="promotion-form" className='relative' onSubmit={ form.handleSubmit( onSubmit ) } noValidate>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">Tạo Khuyến Mãi Mới</h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        <Card className='shadow-none border-none bg-white lg:col-span-2 xl:col-span-2'>
                            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                                <CardTitle>Thông Tin Cơ Bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={ form.control }
                                        name="name"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Tên Khuyến Mãi *</FormLabel>
                                                <FormControl>
                                                    <Input disabled={ createPromotionMutation.isPending } placeholder="Nhập tên sản phẩm" { ...field } />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ form.control }
                                        name="priority"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Độ ưu tiên *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={ createPromotionMutation.isPending }
                                                        placeholder="Nhập độ ưu tiên"
                                                        { ...field }
                                                        onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                </div>
                                <FormField
                                    control={ form.control }
                                    name="shortDescription"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Mô tả ngắn khuyễn mãi*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={ createPromotionMutation.isPending }
                                                    placeholder="Nhập tóm tắt khuyến mãi"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="description"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Mô tả khuyến mãi</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={ createPromotionMutation.isPending }
                                                    placeholder="Nhập mô tả khuyến mãi"
                                                    className="min-h-[100px]"
                                                    { ...field }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </CardContent>
                        </Card>
                        <div className="space-y-4 lg:col-span-1 xl:col-span-1">
                            <Card className='shadow-none border-none bg-white '>
                                <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                                    <CardTitle>
                                        Điều kiện khuyến mãi
                                        <FormMessage className="text-red-500 text-sm font-normal mt-2">
                                            { form.formState.errors.ruleConditions?.message }
                                        </FormMessage>
                                    </CardTitle>
                                    <RuleConditionDialog
                                        isOpen={ isConditionDialogOpen }
                                        onOpenChange={ setIsConditionDialogOpen }
                                        initialData={ editingConditionIndex !== null ? ruleConditions[ editingConditionIndex ] : undefined }
                                        onSave={ handleSaveCondition }
                                        isSubmitting={ createPromotionMutation.isPending }
                                    >
                                        <Button variant="outline" size="sm" className="ml-auto" type="button" disabled={ createPromotionMutation.isPending } onClick={ () => handleOpenConditionDialog() }>
                                            Thêm
                                            <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </RuleConditionDialog>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ScrollArea className="max-h-[200px] overflow-y-auto w-full">
                                        <div className='mx-1'>
                                            { ruleConditions.map( ( condition, index ) => (
                                                <div key={ condition.id } className="p-3 my-2 border rounded-lg relative group bg-secondary/30 hover:cursor-pointer" onClick={ () => handleOpenConditionDialog( index ) }>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
                                                        onClick={ ( e ) =>
                                                        {
                                                            e.stopPropagation(); // Prevent opening the dialog
                                                            removeCondition( index );
                                                        } }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove condition</span>
                                                    </Button>
                                                    <p className="text-sm font-semibold">Điều kiện #{ index + 1 }</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Loại: <span className="font-mono text-red-500">
                                                            {
                                                                form.watch( `ruleConditions.${ index }.conditionType` ) === 0
                                                                    ? "Giá trị tối thiểu của giỏ hàng"
                                                                    : form.watch( `ruleConditions.${ index }.conditionType` ) === 1
                                                                        ? "Giỏ hàng chứa sản phẩm"
                                                                        : "Số lượng của sản phẩm trong giỏ hàng"
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Toán tử: <span className="font-mono text-orange-400">
                                                            {
                                                                form.watch( `ruleConditions.${ index }.operator` ) === 0
                                                                    ? "Lớn hơn hoặc bằng (≥)"
                                                                    : form.watch( `ruleConditions.${ index }.operator` ) === 1
                                                                        ? "Bằng nhau (=)"
                                                                        : form.watch( `ruleConditions.${ index }.operator` ) === 2
                                                                            ? "Lớn hơn (>)"
                                                                            : form.watch( `ruleConditions.${ index }.operator` ) === 3
                                                                                ? "Chứa bất kì sản phẩm trong danh sách"
                                                                                : form.watch( `ruleConditions.${ index }.operator` ) === 4
                                                                                    ? "Chứa tất cả sản phẩm trong danh sách"
                                                                                    : "Chứa chính xác sản phẩm trong danh sách"
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            ) ) }
                                            {
                                                ruleConditions.length === 0 && (
                                                    <div className="text-gray-500 text-sm text-center min-h-20">
                                                        Chưa có điều kiện nào được thêm.
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className='shadow-none border-none bg-white '>
                                <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                                    <CardTitle>
                                        Hành động khuyến mãi
                                        <FormMessage className="text-red-500 text-sm font-normal mt-2">
                                            { form.formState.errors.ruleActions?.message }
                                        </FormMessage>
                                    </CardTitle>


                                    <RuleActionDialog
                                        isOpen={ isActionDialogOpen }
                                        onOpenChange={ setIsActionDialogOpen }
                                        initialData={ ruleAction }
                                        onSave={ handleSaveAction }
                                        isSubmitting={ createPromotionMutation.isPending }
                                    >
                                        <Button variant="outline" size="sm" className="ml-auto" type="button" disabled={ createPromotionMutation.isPending } onClick={ () => setIsActionDialogOpen( true ) }>
                                            {
                                                ruleAction ? "Cập nhật" : "Thêm"
                                            }
                                            <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </RuleActionDialog>

                                </CardHeader>
                                <CardContent className="space-y-4">
                                    { ruleAction ? (
                                        <div className="p-3 border rounded-lg relative group bg-secondary/30 hover:cursor-pointer" onClick={ () => setIsActionDialogOpen( true ) }>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
                                                onClick={ ( e ) =>
                                                {
                                                    e.stopPropagation();
                                                    form.setValue( "ruleActions", undefined );
                                                } }
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove action</span>
                                            </Button>
                                            <p className="text-sm font-semibold pr-6">
                                                { getActionTypeName( ruleAction.actionType ) }
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        ( ruleAction.actionType === 1 || ruleAction.actionType === 4 || ruleAction.actionType === 5 )
                                                            ? "Giá trị"
                                                            : ( ruleAction.actionType === 0 || ruleAction.actionType === 2 || ruleAction.actionType === 3 )
                                                                ? "Phần trăm giảm giá"
                                                                : "Số lượng"
                                                    }: <span className="font-mono text-blue-500">
                                                        {
                                                            ( ruleAction.actionType === 1 || ruleAction.actionType === 4 || ruleAction.actionType === 5 )
                                                                ? formatPrice( Number( ruleAction.value ) )
                                                                : ( ruleAction.actionType === 0 || ruleAction.actionType === 2 || ruleAction.actionType === 3 )
                                                                    ? `${ ruleAction.value }%`
                                                                    :
                                                                    ruleAction.value
                                                        }
                                                    </span>
                                                </p>
                                                { ( ruleAction.actionType === 0 ) && ruleAction.maxDiscountAmountForPercentage && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Giảm tối đa: <span className="font-mono text-green-600">{ formatPrice( Number( ruleAction.maxDiscountAmountForPercentage ) ) }</span>
                                                    </p>
                                                ) }
                                                { ruleAction.targetCriteriaForItemAction && ruleAction.targetCriteriaForItemAction.length > 0 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Sản phẩm áp dụng: <span className="font-mono text-purple-600">{ ruleAction.targetCriteriaForItemAction.length } sản phẩm</span>
                                                    </p>
                                                ) }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center text-gray-500 text-sm text-center min-h-20">
                                            Chưa có hành động nào được thêm.
                                        </div>
                                    ) }
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky bottom-0 bg-transparent z-10">
                    <Button form="promotion-form" className='mr-8 py-5 px-10' type="submit" disabled={ createPromotionMutation.isPending }>
                        Tạo
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreatePromotionPage
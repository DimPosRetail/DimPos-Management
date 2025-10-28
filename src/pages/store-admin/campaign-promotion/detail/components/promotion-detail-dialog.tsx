import { createSimpleStatusBadge } from '@/components/table/table-formatter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/utils';
import { getActionTypeName, type TPromotionRuleResponse } from '@/schema/promotion-rule.schema';

type Props = {
    promotionData: TPromotionRuleResponse;
    isOpen: boolean;
    onClose: () => void;
}

const PromotionDetailDialog = ( { promotionData, isOpen, onClose }: Props ) =>
{
    return (
        <Dialog open={ isOpen } onOpenChange={ onClose }>
            <DialogContent className="max-w-[550px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[1000px] xl:max-w-[1200px] max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{ promotionData.name }</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {/* Basic Information */ }
                        <Card className='shadow-none border-none bg-white lg:col-span-2 xl:col-span-2 gap-1'>
                            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4 mb-4'>
                                <CardTitle className='text-xl font-semibold'>Thông Tin Cơ Bản</CardTitle>
                                <div className="flex justify-end items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        {createSimpleStatusBadge({ isActive: promotionData.isActive })}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Tên Khuyến Mãi *</Label>
                                        <Input value={ promotionData.name } disabled className="mt-1" />
                                    </div>
                                    <div>
                                        <Label>Độ ưu tiên *</Label>
                                        <Input value={ promotionData.priority } disabled className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Mô tả ngắn khuyến mãi*</Label>
                                    <Input value={ promotionData.shortDescription } disabled className="mt-1" />
                                </div>
                                <div>
                                    <Label>Mô tả khuyến mãi</Label>
                                    <Textarea
                                        value={ promotionData.description }
                                        disabled
                                        className="min-h-[100px] mt-1"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conditions and Actions */ }
                        <div className="space-y-4 lg:col-span-1 xl:col-span-1">
                            {/* Rule Conditions */ }
                            <Card className='shadow-none border-none bg-white gap-1'>
                                <CardHeader className='grid grid-cols-1 items-center gap-4'>
                                    <CardTitle>
                                        Điều kiện khuyến mãi
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({ promotionData.ruleConditions?.length || 0 })
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ScrollArea className="max-h-[300px] overflow-y-auto w-full">
                                        <div className='mx-1'>
                                            { promotionData.ruleConditions && promotionData.ruleConditions!.map( ( _, index ) => (
                                                <div key={ index } className="p-3 my-2 border rounded-lg relative group bg-secondary/30">
                                                    <p className="text-sm font-semibold">Điều kiện #{ index + 1 }</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Loại: <span className="font-mono text-red-500">
                                                            {
                                                                promotionData.ruleConditions![ index ].conditionType === 0
                                                                    ? "Giá trị tối thiểu của giỏ hàng"
                                                                    : promotionData.ruleConditions![ index ].conditionType === 1
                                                                        ? "Giỏ hàng chứa sản phẩm"
                                                                        : "Số lượng của sản phẩm trong giỏ hàng"
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Toán tử: <span className="font-mono text-orange-400">
                                                            {
                                                                promotionData.ruleConditions![ index ].operator === 0
                                                                    ? "Lớn hơn hoặc bằng (≥)"
                                                                    : promotionData.ruleConditions![ index ].operator === 1
                                                                        ? "Bằng nhau (=)"
                                                                        : promotionData.ruleConditions![ index ].operator === 2
                                                                            ? "Lớn hơn (>)"
                                                                            : promotionData.ruleConditions![ index ].operator === 3
                                                                                ? "Chứa bất kì sản phẩm trong danh sách"
                                                                                : promotionData.ruleConditions![ index ].operator === 4
                                                                                    ? "Chứa tất cả sản phẩm trong danh sách"
                                                                                    : "Chứa chính xác sản phẩm trong danh sách"
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            ) ) }
                                            {
                                                promotionData.ruleConditions?.length === 0 && (
                                                    <div className="text-gray-500 text-sm text-center min-h-20">
                                                        Chưa có điều kiện nào được thêm.
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Rule Actions */ }
                            <Card className='shadow-none border-none bg-white gap-1'>
                                <CardHeader className='grid grid-cols-1 items-center gap-4'>
                                    <CardTitle>
                                        Hành động khuyến mãi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    { promotionData.ruleActions ? (
                                        <div className="p-3 border rounded-lg relative group bg-secondary/30">
                                            <p className="text-sm font-semibold pr-6">
                                                { getActionTypeName( promotionData.ruleActions.actionType ) }
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {
                                                        ( promotionData.ruleActions.actionType === 1 || promotionData.ruleActions.actionType === 4 || promotionData.ruleActions.actionType === 5 )
                                                            ? "Giá trị"
                                                            : ( promotionData.ruleActions.actionType === 0 || promotionData.ruleActions.actionType === 2 || promotionData.ruleActions.actionType === 3 )
                                                                ? "Phần trăm giảm giá"
                                                                : "Số lượng"
                                                    }: <span className="font-mono text-blue-500">
                                                        {
                                                            ( promotionData.ruleActions.actionType === 1 || promotionData.ruleActions.actionType === 4 || promotionData.ruleActions.actionType === 5 )
                                                                ? formatPrice( Number( promotionData.ruleActions.value ) )
                                                                : ( promotionData.ruleActions.actionType === 0 || promotionData.ruleActions.actionType === 2 || promotionData.ruleActions.actionType === 3 )
                                                                    ? `${ promotionData.ruleActions.value }%`
                                                                    :
                                                                    promotionData.ruleActions.value
                                                        }
                                                    </span>
                                                </p>
                                                { ( promotionData.ruleActions.actionType === 0 ) && promotionData.ruleActions.maxDiscountAmountForPercentage && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Giảm tối đa: <span className="font-mono text-green-600">{ formatPrice( Number( promotionData.ruleActions.maxDiscountAmountForPercentage ) ) }</span>
                                                    </p>
                                                ) }
                                                { ( promotionData.ruleActions.targetCriteriaForItemAction ) && ( JSON.parse( promotionData.ruleActions.targetCriteriaForItemAction ) as string[] ).length > 0 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Sản phẩm áp dụng: <span className="font-mono text-purple-600">{ ( JSON.parse( promotionData.ruleActions.targetCriteriaForItemAction ) as string[] ).length } sản phẩm</span>
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
                </ScrollArea>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={ onClose }>
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PromotionDetailDialog;

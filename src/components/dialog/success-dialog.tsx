import CreateSuccessIllustration from '@/assets/illustration/create-success-illustration'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Props = {
    open: boolean
    onOpenChange: ( open: boolean ) => void
    title?: string
    actionLabel?: string
    onAction?: () => void
}

const SuccessDialog = ( {
    open,
    onOpenChange,
    title = "Tạo sản phẩm mới thành công",
    actionLabel = "Xem sản phẩm",
    onAction
}: Props ) =>
{
    return (
        <Dialog open={ open } onOpenChange={ onOpenChange }>
            <DialogContent className="sm:max-w-[400px] rounded-3xl [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-semibold'>
                        { title }
                    </DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                    <CreateSuccessIllustration className="size-60" />
                </div>
                <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-2/5 text-sidebar-label">
                            Đóng
                        </Button>
                    </DialogClose>
                    { onAction && (
                        <Button
                            onClick={ onAction }
                            className="w-full sm:w-3/5"
                        >
                            { actionLabel }
                        </Button>
                    ) }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SuccessDialog
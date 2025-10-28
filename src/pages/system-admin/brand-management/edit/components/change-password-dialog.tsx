import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PasswordInput } from '@/components/ui/input';
import { useBrand } from '@/hooks/use-brand';
import { handleApiError } from '@/lib/error';
import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
    brandId: string;
    children: ReactNode;
}

const ChangePassWordDialog = ( {
    brandId,
    children,
}: Props ) =>
{

    const [ open, setOpen ] = useState( false );
    const [ password, setPassword ] = useState( '' );
    const { changePasswordForBrandMutation } = useBrand();

    useEffect( () =>
    {
        setPassword( '' );
    }, [ open ] );

    const handleChangePassword = async () =>
    {
        try
        {
            await changePasswordForBrandMutation.mutateAsync( { id: brandId, data: { password } } );
            setOpen( false );
            setPassword( '' );
            toast.success( 'Đổi mật khẩu thành công!' );
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu thương hiệu</DialogTitle>
                </DialogHeader>
                <div className="my-5">
                    <PasswordInput
                        placeholder="Nhập mật khẩu mới"
                        value={ password }
                        onChange={ e => setPassword( e.target.value ) }
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={ () => setOpen( false ) }>
                        Hủy
                    </Button>
                    <Button
                        onClick={ handleChangePassword }
                        disabled={ !password || changePasswordForBrandMutation.isPending }
                    >
                        Đổi mật khẩu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePassWordDialog
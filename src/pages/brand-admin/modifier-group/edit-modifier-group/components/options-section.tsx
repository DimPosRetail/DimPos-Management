import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TModifierOptionResponse } from '@/schema/product.schema'
import OptionForm from './option-form'
import { Button } from '@/components/ui/button'
import { CircleArrowOutUpRight } from 'lucide-react'
import AddOptionDialog from './add-option-dialog'

type Props = {
    modifierGroupId: string;
    isDisabled: boolean;
    initialData: TModifierOptionResponse[]
}

const OptionsSection = ( {
    modifierGroupId,
    isDisabled = false,
    initialData = []
}: Props ) =>
{
    return (
        <Card className='border-none shadow-none bg-white gap-3'>
            <CardHeader className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                <CardTitle>Các tùy chọn</CardTitle>
                <AddOptionDialog
                    modifierGroupId={ modifierGroupId }
                >
                    <Button variant="outline" size="sm" className="ml-auto" type="button" disabled={ isDisabled }>
                        Thêm tùy chọn
                        <CircleArrowOutUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </AddOptionDialog>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className="space-y-2">
                    { initialData.map( ( option ) => (
                        <OptionForm
                            key={ option.id }
                            optionId={ option.id }
                            initialData={ option }
                            isDisabled={ isDisabled }
                        />
                    ) ) }
                </div>
            </CardContent>
        </Card>
    )
}

export default OptionsSection
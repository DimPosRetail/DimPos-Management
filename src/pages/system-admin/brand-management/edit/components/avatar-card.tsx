import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoProvider, PhotoView } from 'react-photo-view';

type Props = {
    pictureUrl?: string;
}

const AvatarCard = ( {
    pictureUrl = "https://via.placeholder.com/150",
}: Props ) =>
{
    return (
        <Card className="lg:col-span-1 bg-white shadow-none border-none gap-3">
            <CardHeader >
                <CardTitle className='text-lg font-semibold'>
                    Ảnh đại diện
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full border rounded-xl flex items-center justify-center bg-gray-50">
                    <PhotoProvider>
                        <PhotoView src={ pictureUrl }>
                            <img
                                src={ pictureUrl }
                                alt="Ảnh đại diện"
                                className="w-full object-cover hover:cursor-pointer"
                            />
                        </PhotoView>
                    </PhotoProvider>
                </div>
            </CardContent>
        </Card>
    )
}

export default AvatarCard
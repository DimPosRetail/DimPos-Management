import DocumentFilterIcon from "@/assets/icons/document-filter-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProduct } from "@/hooks/use-product";
import { Target } from "lucide-react";
import { useParams } from "react-router-dom"
import OverviewSection from "./components/overview-section";
import type { TUpdateModifierGroupRequest } from "@/schema/product.schema";
import OptionsSection from "./components/options-section";

const EditModifierGroupPage = () =>
{
    const { id } = useParams<{ id: string }>();
    console.log( "Editing Modifier Group with ID:", id );

    const { getModifierGroupById } = useProduct();
    const { data } = getModifierGroupById( id as string );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{ data?.data.data.name }</h1>
            </div>
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">
                        <div className="flex items-center gap-2 text-base">
                            <Target className="w-4 h-4" />
                            Tổng quan
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="options">
                        <div className="flex items-center gap-2 text-base">
                            <DocumentFilterIcon className="w-4 h-4 mr-2" />
                            Các tùy chọn
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <OverviewSection
                        initialData={ data?.data.data as TUpdateModifierGroupRequest }
                        modifierGroupId={ id as string }
                    />
                </TabsContent>
                <TabsContent value="options">
                    <OptionsSection
                        modifierGroupId={ id as string }
                        isDisabled={ data?.data.data.isActive === false }
                        initialData={ data?.data.data.modifierOptions || [] }
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditModifierGroupPage
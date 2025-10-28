import CampaignTable from "./components/campaign-table"

const CampaignPromotionPage = () =>
{
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Chiến dịch khuyến mãi</h1>
            </div>
            <CampaignTable />
        </div>
    )
}

export default CampaignPromotionPage
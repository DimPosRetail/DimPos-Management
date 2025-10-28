import StoreMenuTable from "./components/store-menu-table"

const StoreMenuPage = () =>
{
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Thực đơn tại của hàng</h1>
            </div>
            <StoreMenuTable />
        </div>
    )
}

export default StoreMenuPage
import SystemPaymentMethodTable from "./components/table";

const SystemPaymentMethodPage = () =>
{

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Quản lý phương thức thanh toán</h1>
                {/* <Link to={ PATH_BRAND_DASHBOARD.category.create }>
                    <Button>
                        <CirclePlus className="mr-2 h-5 w-5" />
                        Tạo danh mục
                    </Button>
                </Link> */}
            </div>
            <SystemPaymentMethodTable />
        </div>
    );
};

export default SystemPaymentMethodPage;
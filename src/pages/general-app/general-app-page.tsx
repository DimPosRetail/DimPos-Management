import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "@/hooks/use-dashboard";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStore } from "@/hooks/use-store";
import { handleApiError } from "@/lib/error";
import { cn, formatLocaleDate } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, DownloadCloudIcon } from "lucide-react";
import { useSelector } from "react-redux";
import KPICard from "./components/kpi-card";
import OrderPieCard from "./components/order-pie-chart";
import RevenuePieCard from "./components/revenue-pie-chart";
import RunningPromotionStoreTable from "./components/running-promotion-store-table";
import RunningPromotionTable from "./components/running-promotion-table";
import ServiceMethodCard from "./components/service-method-card";

const GeneralAppPage = () =>
{
  const { getDashboardBrand, getDashboardStore, exportDashboardBrandReport, exportDashboardStoreReport } = useDashboard();
  const { getStoresByBrand } = useStore();
  const { role } = useSelector( ( state: RootState ) => state.user );
  const { data: storeData } = getStoresByBrand( role!, { page: 1, size: 10000 } );
  const {
    filter,
    setFilter,
  } = useQueryParams( {
    defaultFilter: [
      {
        id: "fromDate",
        value: new Date().toISOString().slice( 0, 10 ), // "YYYY-MM-DD"
      },
      {
        id: "toDate",
        value: new Date().toISOString().slice( 0, 10 ), // "YYYY-MM-DD"
      },
      {
        id: "storeId",
        value: null,
      }
    ]
  } );
  const { data: dashboardBrandData, isLoading: isDashboardBrandDataLoading, isError: isDashboardBrandDataError, error: dashboardBrandDataError } = getDashboardBrand( role!, {
    storeId: filter.find( f => f.id === "storeId" )?.value as string || null,
    fromDate: filter.find( f => f.id === "fromDate" )!.value as string,
    toDate: filter.find( f => f.id === "toDate" )!.value as string,
  } );

  const { data: dashboardStoreData, isLoading: isDashboardStoreDataLoading, isError: isDashboardStoreDataError, error: dashboardStoreDataError } = getDashboardStore( role!, {
    fromDate: filter.find( f => f.id === "fromDate" )!.value as string,
    toDate: filter.find( f => f.id === "toDate" )!.value as string,
  } );

  if ( isDashboardBrandDataError && dashboardBrandDataError )
  {
    handleApiError( dashboardBrandDataError );
  }

  if ( isDashboardStoreDataError && dashboardStoreDataError )
  {
    handleApiError( dashboardStoreDataError );
  }

  // const { exportStockReportMutation } = ();
  const handleExportReport = async () =>
  {
    try
    {
      if ( role === "BrandAdmin" )
      {
        const response = await exportDashboardBrandReport.mutateAsync( {
          fromDate: filter.find( f => f.id === "fromDate" )!.value as string,
          toDate: filter.find( f => f.id === "toDate" )!.value as string,
        } );
        const url = response.data.data;
        window.open( url, '_blank' );
      }
      else if ( role === "StoreAdmin" )
      {
        const response = await exportDashboardStoreReport.mutateAsync( {
          fromDate: filter.find( f => f.id === "fromDate" )!.value as string,
          toDate: filter.find( f => f.id === "toDate" )!.value as string,
        } );
        const url = response.data.data;
        window.open( url, '_blank' );
      }
    } catch ( error )
    {
      handleApiError( error );
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Tổng quan</h1>
        <Button className="px-12 py-6 rounded-xl text-base" onClick={ handleExportReport } disabled={ ( role === "BrandAdmin" && exportDashboardBrandReport.isPending ) || ( role === "StoreAdmin" && exportDashboardStoreReport.isPending ) } >
          <div className="flex justify-center items-center ">
            <DownloadCloudIcon
              className="mr-3 bg-primary text-white size-5"
              fill="none"
            />
            Xuất báo cáo
          </div>
        </Button>
      </div>

      {/* Filter Bar */ }
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center ">
        {/* From Date */ }
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Từ ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={ cn(
                  "w-[200px] justify-start text-left font-normal",
                  !filter.find( f => f.id === "fromDate" )?.value && "text-muted-foreground"
                ) }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                { filter.find( f => f.id === "fromDate" )?.value
                  ? format( new Date( filter.find( f => f.id === "fromDate" )!.value as string ), "dd/MM/yyyy", { locale: vi } )
                  : "Chọn ngày" }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={ filter.find( f => f.id === "fromDate" )?.value ? new Date( filter.find( f => f.id === "fromDate" )!.value as string ) : undefined }
                onSelect={ ( date ) =>
                {
                  if ( date )
                  {
                    setFilter( [
                      ...filter.filter( f => f.id !== "fromDate" ),
                      { id: "fromDate", value: formatLocaleDate( date ) }
                    ] );
                  }
                } }
                locale={ vi }
                initialFocus
                disabled={
                  filter.find( f => f.id === "toDate" )?.value
                    ? ( date ) => date >= new Date( filter.find( f => f.id === "toDate" )!.value as string )
                    : undefined
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */ }
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Đến ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={ cn(
                  "w-[200px] justify-start text-left font-normal",
                  !filter.find( f => f.id === "toDate" )?.value && "text-muted-foreground"
                ) }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                { filter.find( f => f.id === "toDate" )?.value
                  ? format( new Date( filter.find( f => f.id === "toDate" )!.value as string ), "dd/MM/yyyy", { locale: vi } )
                  : "Chọn ngày" }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={ filter.find( f => f.id === "toDate" )?.value ? new Date( filter.find( f => f.id === "toDate" )!.value as string ) : undefined }
                onSelect={ ( date ) =>
                {
                  console.log( date );
                  console.log( date!.toISOString().slice( 0, 10 ) );
                  if ( date )
                  {
                    setFilter( [
                      ...filter.filter( f => f.id !== "toDate" ),
                      { id: "toDate", value: formatLocaleDate( date ) }
                    ] );
                  }
                } }
                initialFocus
                locale={ vi }
                disabled={
                  filter.find( f => f.id === "fromDate" )?.value
                    ? ( date ) => date <= new Date( filter.find( f => f.id === "fromDate" )!.value as string )
                    : undefined
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Store Selector - Only for Brand Admin */ }
        { role === "BrandAdmin" && (
          <div className="flex flex-col space-y-1 flex-grow">
            <label className="text-sm font-medium text-muted-foreground">Chọn cửa hàng</label>
            <Select
              value={ filter.find( f => f.id === "storeId" )?.value as string || "all" }
              onValueChange={ ( value ) =>
              {
                setFilter( [
                  ...filter.filter( f => f.id !== "storeId" ),
                  { id: "storeId", value: value === "all" ? null : value }
                ] );
              } }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">Toàn hệ thống</SelectItem>
                { storeData?.data.data.items?.map( ( store ) => (
                  <SelectItem key={ store.id } value={ store.id }>
                    { store.name }
                  </SelectItem>
                ) ) }
              </SelectContent>
            </Select>
          </div>
        ) }
      </div>

      {
        ( role === "BrandAdmin" || role === "StoreAdmin" ) &&
        <KPICard
          role={ role! }
          dashboardBrandData={ dashboardBrandData?.data.data }
          dashboardStoreData={ dashboardStoreData?.data.data }
          isDashboardBrandDataLoading={ isDashboardBrandDataLoading }
          isDashboardStoreDataLoading={ isDashboardStoreDataLoading }
        />
      }

      {/* Main Content Grid */ }
      {
        ( role === "BrandAdmin" || role === "StoreAdmin" ) &&
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <RevenueChart /> */ }
          <RevenuePieCard
            role={ role! }
            dashboardBrandData={ dashboardBrandData?.data.data }
            dashboardStoreData={ dashboardStoreData?.data.data }
            isDashboardBrandDataLoading={ isDashboardBrandDataLoading }
            isDashboardStoreDataLoading={ isDashboardStoreDataLoading }
          />
          <OrderPieCard
            role={ role! }
            dashboardBrandData={ dashboardBrandData?.data.data }
            dashboardStoreData={ dashboardStoreData?.data.data }
            isDashboardBrandDataLoading={ isDashboardBrandDataLoading }
            isDashboardStoreDataLoading={ isDashboardStoreDataLoading }
          />
        </div>
      }

      {/* Bottom Section */ }
      {
        ( role === "BrandAdmin" || role === "StoreAdmin" ) &&
        <ServiceMethodCard
          role={ role! }
          dashboardBrandData={ dashboardBrandData?.data.data }
          dashboardStoreData={ dashboardStoreData?.data.data }
          isDashboardBrandDataLoading={ isDashboardBrandDataLoading }
          isDashboardStoreDataLoading={ isDashboardStoreDataLoading }
        />
      }

      {/* Campaign Section*/ }
      { role === "BrandAdmin" &&
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          <RunningPromotionTable />
        </div>
      }

      { role === "StoreAdmin" &&
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          <RunningPromotionStoreTable />
        </div>
      }
    </div>
  );
};

export default GeneralAppPage;

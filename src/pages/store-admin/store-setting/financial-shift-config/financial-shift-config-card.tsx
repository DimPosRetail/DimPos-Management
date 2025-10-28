import { useState } from "react";

import { useQueryParams } from "@/hooks/use-query-params";
import { useFinancialShiftConfig } from "@/hooks/use-financial-shift-config";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";

import CreateFinancialShiftDialog from "./components/create-financial-shift-config-dialog";
import UpdateFinancialShiftDialog from "./components/edit-financial-shift-config-dialog";
import { financialShiftColumns } from "./components/column";

import type { TStoreFinancialShiftConfig } from "@/schema/financial-shift-configs";

const FinancialShiftConfigCard = () => {
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
  } = useQueryParams({
    defaultSortBy: "createdDate",
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<TStoreFinancialShiftConfig | null>(null);

  const {
    getFinancialShiftConfigs,
    getFinancialShiftConfigById,
    createFinancialShiftConfigMutation,
    updateFinancialShiftConfigMutation,
  } = useFinancialShiftConfig({
    onCreateSuccess: () => setOpenCreate(false),
    onUpdateSuccess: () => setOpenUpdate(false),
  });

  const { data, isLoading } = getFinancialShiftConfigs({
    page: currentPage,
    size: pageSize,
    sortBy,
    isAsc,
  });

  const items = data?.data.items ?? [];
  const total = data?.data.total ?? 0;

  return (
    <>
      <Card className="col-span-full bg-white shadow-none border-none gap-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cấu hình ca tài chính</CardTitle>
          <Button
            onClick={() => {
              setSelectedConfig(null);
              setOpenCreate(true);
            }}
          >
            + Thêm ca tài chính
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={financialShiftColumns({
              onEdit: (configId) => {
                const config = items.find((c) => c.id === configId);
                if (config) {
                  setSelectedConfig(config);
                  setOpenUpdate(true);
                }
              },
              onToggleStatus: (configId) => {
                getFinancialShiftConfigById(configId);
              },
            })}
            data={items}
            isLoading={isLoading}
            totalItems={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            sortValues={[
              {
                id: sortBy,
                desc: !isAsc,
              },
            ]}
            onSortChange={(newSort) => {
              const newSortItem = newSort?.[0];
              if (newSortItem) {
                setSort(newSortItem.id, !newSortItem.desc);
              }
            }}
          />
        </CardContent>
      </Card>

      <CreateFinancialShiftDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        createConfigMutation={createFinancialShiftConfigMutation}
      />

      <UpdateFinancialShiftDialog
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        data={selectedConfig}
        updateMutation={updateFinancialShiftConfigMutation}
      />
    </>
  );
};

export default FinancialShiftConfigCard;

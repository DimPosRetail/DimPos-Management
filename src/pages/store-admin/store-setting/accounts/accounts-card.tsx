import { useState } from "react";
import { useStaff } from "@/hooks/use-staff";
import { useQueryParams } from "@/hooks/use-query-params";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { staffColumns } from "./components/column";
import CreateAccountDialog from "./components/create-account-dialog";
import type { TStaff } from "@/schema/staff.schema";
import UpdateAccountDialog from "./components/edit-account-dialog";

const AccountsCard = () => {
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setSort,
    setPage,
    setPageSize,
  } = useQueryParams({
    defaultSortBy: "assignAt",
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<TStaff | null>(null);

  const {
    getStaffs,
    createStaffMutation,
    updateStaffMutation,
  } = useStaff({
    onCreateSuccess: () => setOpenCreate(false),
    onUpdateSuccess: () => setOpenUpdate(false),
  });

  const { data, isLoading } = getStaffs({
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
          <CardTitle>Danh sách tài khoản nhân viên</CardTitle>
          <Button
            onClick={() => {
              setSelectedStaff(null);
              setOpenCreate(true);
            }}
          >
            + Tạo tài khoản
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={staffColumns({
              onEdit: (staffId) => {
                const staff = items.find((s) => s.id === staffId);
                if (staff) {
                  setSelectedStaff(staff);
                  setOpenUpdate(true);
                }
              },
            })}
            data={items}
            isLoading={isLoading}
            totalItems={total}
            isShort={false}
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
              setSort(newSort[0].id, !newSort[0].desc);
            }}
          />
        </CardContent>
      </Card>

      <CreateAccountDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        createStaffMutation={createStaffMutation}
      />

      <UpdateAccountDialog
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        staff={selectedStaff}
        updateStaffMutation={updateStaffMutation}
      />
    </>
  );
};

export default AccountsCard;

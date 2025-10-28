import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";
import {
  StorePurchaseOrder,
  type TStorePurchaseOrder,
} from "@/schema/internal-purchase-orders.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./po-item/columns";

type Props = {
  initialData: TStorePurchaseOrder;
};

const EditPOProductForm = ({ initialData }: Props) => {

  const form = useForm<TStorePurchaseOrder>({
    resolver: zodResolver(StorePurchaseOrder),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        createdDate: initialData.createdDate
          ? new Date(initialData.createdDate)
          : undefined,
        completedAt: initialData.completedAt
          ? new Date(initialData.completedAt)
          : undefined,
        confirmedByBrandAt: initialData.confirmedByBrandAt
          ? new Date(initialData.confirmedByBrandAt)
          : undefined,
        cancelledAt: initialData.cancelledAt
          ? new Date(initialData.cancelledAt)
          : undefined,
        lastModifiedDate: initialData.lastModifiedDate
          ? new Date(initialData.lastModifiedDate)
          : undefined,
      });
    }
  }, [initialData]);

  return (
    <Form {...form}>
      <form>
        <Card className="bg-neutral-0">
          <CardContent>
            <DataTable
              columns={columns}
              data={
                (initialData.storePurchaseOrderItems ?? []) as TStorePurchaseOrderItem[]
              }
              totalItems={initialData.storePurchaseOrderItems?.length ?? 0}
              currentPage={1}
              pageSize={initialData.storePurchaseOrderItems?.length ?? 0}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              isPagingProp={false}
              meta={{
                poStatus: initialData.status,
              }}
              rowSelection={{}}
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditPOProductForm;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TStorePurchaseOrderItem } from "@/schema/internal-purchase-order-items.schema";
import { Edit } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: (reason?: TStorePurchaseOrderItem[]) => void;
  textPlaceHolder?: string;
  storePurchaseOrderItems: TStorePurchaseOrderItem[];
};

export default function BrandConfirmPODialog({
  open,
  onOpenChange,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  actionLabel = "Xác nhận",
  onAction,
  storePurchaseOrderItems = [],
}: Props) {
  const [editingRowIds, setEditingRowIds] = useState<string[]>([]);

  const [editedApprovedQuantities, setEditedApprovedQuantities] = useState<
    Record<string, number>
  >({});

  const handleEditClick = (id: string) => {
    if (!editingRowIds.includes(id)) {
      setEditingRowIds((prev) => [...prev, id]);
    }

    const item = storePurchaseOrderItems.find((e) => e.id === id);
    setEditedApprovedQuantities((prev) => ({
      ...prev,
      [id]: item?.approvedQuantityByBrand ?? item?.requestedQuantity ?? 0,
    }));
  };

  const handleCancelEdit = (id: string) => {
    setEditingRowIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleQuantityChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setEditedApprovedQuantities((prev) => ({
        ...prev,
        [id]: num,
      }));
    }
  };
  const handleConfirm = () => {
    if (onAction) {
      const updatedItems = storePurchaseOrderItems.map((item) => ({
        ...item,
        approvedQuantityByBrand:
          editedApprovedQuantities[item.id] ??
          item.approvedQuantityByBrand ??
          item.requestedQuantity,
      }));
      onAction(updatedItems);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[735px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {storePurchaseOrderItems.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto mb-4 border rounded">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="bg-white">
                <TableRow>
                  <TableHead className="text-left">Sản phẩm</TableHead>
                  <TableHead className="text-center">
                    Số lượng yêu cầu
                  </TableHead>
                  <TableHead className="text-center">
                    Số lượng đáp ứng
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storePurchaseOrderItems.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-left">
                      {e.productVariantNameSnapshot}
                    </TableCell>
                    <TableCell className="text-center">
                      {e.requestedQuantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingRowIds.includes(e.id) ? (
                        <Input
                          type="number"
                          min={0}
                          value={editedApprovedQuantities[e.id] ?? ""}
                          onChange={(event) =>
                            handleQuantityChange(e.id, event.target.value)
                          }
                          className="w-20 mx-auto text-center"
                        />
                      ) : (
                        e.approvedQuantityByBrand ?? e.requestedQuantity
                      )}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {editingRowIds.includes(e.id) ? (
                        <Button
                          className="w-[120px]"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelEdit(e.id)}
                        >
                          Hủy
                        </Button>
                      ) : (
                        <Button
                          className="w-[120px]"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(e.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Chỉnh sửa
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button className="px-12 py-6 text-base" variant="outline">
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="px-12 py-6 text-base"
            onClick={handleConfirm}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Save, MapPin } from "lucide-react";
import {
  UpdateStoreRequestSchema,
  type TStoreResponse,
  type TUpdateStoreRequest,
} from "@/schema/store.schema";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error";
import { useStore } from "@/hooks/use-store";

interface Props {
  initialData: TStoreResponse;
}

const DetailCardView = ({ initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateStoreDetailMutation } = useStore();
  const form = useForm<TUpdateStoreRequest>({
    resolver: zodResolver(UpdateStoreRequestSchema),
    defaultValues: {
      ...initialData,
      latitude: initialData.latitude ?? "",
      longitude: initialData.longitude ?? "",
    },
  });

  const { register, handleSubmit, reset, watch } = form;

  const onSubmit = async (data: TUpdateStoreRequest) => {
    try {
      await updateStoreDetailMutation.mutateAsync({ id: initialData.id, data });
      toast.success("Cập nhật thông tin cửa hàng thành công");
      setIsEditing(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="col-span-full bg-white shadow-none border-none gap-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Thông tin cửa hàng</CardTitle>
            <CardDescription></CardDescription>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button type="submit" variant="default">
                <Save className="mr-2 h-4 w-4" />
                Lưu
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Tên cửa hàng</p>
            <Input {...register("name")} disabled={!isEditing} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Mã cửa hàng</p>
            <Input {...register("code")} disabled />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Tên nội bộ</p>
            <Input {...register("shortName")} disabled={!isEditing} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Mã nội bộ</p>
            <Input {...register("localPasscode")} disabled={!isEditing} />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Quản lí cửa hàng</p>
            <Input {...register("managerName")} disabled={!isEditing} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Tiền két cửa hàng</p>
            <Input
              value={watch("startingStoreCashLending") + " đ"}
              disabled
              readOnly
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Email</p>
            <Input {...register("email")} disabled={!isEditing} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Số điện thoại</p>
            <Input {...register("phone")} disabled={!isEditing} />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-foreground mb-2">Địa chỉ cửa hàng</p>
            <Input {...register("address")} disabled={!isEditing} />
          </div>

          {!isEditing ? (
            <div className="md:col-span-2 flex flex-wrap items-center justify-between rounded-lg bg-muted px-4 py-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Tọa độ:</p>
                <span className="text-sm text-muted-foreground">{latitude}, {longitude}</span>
              </div>
              {latitude && longitude && (
                <a
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  Xem trên bản đồ
                </a>
              )}
            </div>
          ) : (
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Vĩ độ</p>
                <Input {...register("latitude")} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Kinh độ</p>
                <Input {...register("longitude")} />
              </div>
            </div>
          )}


          <div>
            <p className="text-sm font-medium text-foreground mb-2">Tên Wifi</p>
            <Input {...register("wifiName")} disabled={!isEditing} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Mật khẩu Wifi</p>
            <Input {...register("wifiPassword")} disabled={!isEditing} />
          </div>

          {initialData.taxRate ? (
            <>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Tên thuế</p>
                <Input value={initialData.taxRate.name} disabled />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Tỷ lệ thuế</p>
                <Input value={`${initialData.taxRate.rate}%`} disabled />
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-foreground mb-2">Thuế</p>
              <Input value="Chưa thiết lập thuế" disabled />
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default DetailCardView;

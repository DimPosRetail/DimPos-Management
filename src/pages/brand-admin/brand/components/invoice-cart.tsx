import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";

const InvoiceCard = () => {
  return (
    <Card className="lg:col-span-2 bg-white shadow-none border-none gap-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Thông tin hóa đơn
          </CardTitle>
        </div>
        <Button variant="default">
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          {/* <p className="text-sm font-medium text-foreground mb-2">
            Tên thương hiệu
          </p>
          <Input
            disabled={true}
            className="bg-background disabled:opacity-90"
          /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;

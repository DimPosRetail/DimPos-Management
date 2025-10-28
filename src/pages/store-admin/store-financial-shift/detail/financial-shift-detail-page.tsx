import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";

import { handleApiError } from "@/lib/error";
import { FinancialShiftSchema, type TStoreFinancialShift } from "@/schema/financial-shift-configs";
import { financialShiftConfigApi } from "@/apis/financial-shift-config.api";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center h-10 rounded-md border border-input bg-muted text-sm text-foreground/80 px-3">
    {children}
  </div>
);

const FinancialShiftEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<TStoreFinancialShift>({
    resolver: zodResolver(FinancialShiftSchema),
    defaultValues: {
      id: "",
      openingTimestamp: "",
      closingTimestamp: null,
      openedByAccountId: "",
      closedByAccountId: null,
      openingCashExpected: 0,
      openingCashActual: 0,
      openingDifferenceReason: "",
      totalGrossSalesInShift: null,
      totalNetSalesInShift: null,
      totalTaxInShift: null,
      totalDiscountInShift: null,
      totalCashRoundingInShift: null,
      status: 1,
      createdDate: "",
      lastModifiedDate: "",
    },
  });

  useEffect(() => {
    if (id) {
      financialShiftConfigApi
        .getFinancialShiftByStoreById(id)
        .then((res) => {
          const shift = res.data.data;
          form.reset({ ...shift });
        })
        .catch(handleApiError);
    }
  }, [id]);

  const watch = form.getValues();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Chi tiết ca tài chính</h1>

      <Form {...form}>
        <form>
          <Card className="bg-neutral-0 mb-10">
            <CardHeader className="text-xl font-semibold">Thông tin ca</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">

                <FormItem>
                  <FormLabel>Nhân viên mở ca</FormLabel>
                  <FormControl>
                    <Input disabled value={watch.openedByAccount?.code || ""} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Nhân viên đóng ca</FormLabel>
                  <FormControl>
                    <Input disabled value={watch.closedByAccount?.code || "—"} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Thời gian mở ca</FormLabel>
                  <FormControl>
                    <InfoBox>
                      {`${formatDate(watch.openingTimestamp)} ${formatTime(watch.openingTimestamp)}`}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </InfoBox>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Thời gian đóng ca</FormLabel>
                  <FormControl>
                    <InfoBox>
                      {watch.closingTimestamp
                        ? `${formatDate(watch.closingTimestamp)} ${formatTime(watch.closingTimestamp)}`
                        : "—"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </InfoBox>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Số tiền két quy định</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.openingCashExpected)} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Tiền mặt thực tế</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.openingCashActual)} />
                  </FormControl>
                </FormItem>

                {watch.openingCashExpected !== watch.openingCashActual && (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Lý do chênh lệch</FormLabel>
                    <FormControl>
                      <Input disabled value={watch.openingDifferenceReason ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
                <FormItem>
                  <FormLabel>Tổng doanh thu (chưa giảm giá, chưa thuế)</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.totalGrossSalesInShift ?? 0)} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Doanh thu thực tế (sau chiết khấu và thuế)</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.totalNetSalesInShift ?? 0)} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Tiền thuế</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.totalTaxInShift ?? 0)} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Tổng chiết khấu</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.totalDiscountInShift ?? 0)} />
                  </FormControl>
                </FormItem>

                <FormItem >
                  <FormLabel>Làm tròn tiền (tiền mặt)</FormLabel>
                  <FormControl>
                    <Input disabled value={formatCurrency(watch.totalCashRoundingInShift ?? 0)} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Trạng thái ca tài chính</FormLabel>
                  <FormControl>
                    <Input disabled value={watch.status === 1 ? "Đang mở" : "Đã đóng"} />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default FinancialShiftEditPage;

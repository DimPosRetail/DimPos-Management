export const PaymentMethodTypeEnum = {
  CASH: 0,
  QR_VIETQR : 1,
  QR_EDC : 2,
  CARD_EDC : 3,
  QR_PAYOS : 4,
} as const;

export type TPaymentMethodTypeEnum =
  typeof PaymentMethodTypeEnum[keyof typeof PaymentMethodTypeEnum];

export function getPaymentMethodTypeLabel(
  type: TPaymentMethodTypeEnum
): string {
  switch (type) {
    case PaymentMethodTypeEnum.CASH:
      return "Tiền mặt";
    case PaymentMethodTypeEnum.QR_VIETQR:
      return "QR VietQR";
    case PaymentMethodTypeEnum.QR_EDC:
      return "QR EDC";
    case PaymentMethodTypeEnum.CARD_EDC:
      return "Thẻ EDC";
    case PaymentMethodTypeEnum.QR_PAYOS:
      return "QR PayOS";
    default:
      return "Không xác định";
  }
}

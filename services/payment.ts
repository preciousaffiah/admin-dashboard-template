import { PaymentMetaDataTypeEnum } from "@/types/enums";
import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

class PaymnetsService {
  initPayment(orderId: string) {
    // payload: { email: string; amount: string }
    const myData = {
      email: "preciousaffiah205@gmail.com",
      metadata: {
        type: PaymentMetaDataTypeEnum.ORDER,
        orderId,
      },
    };
    return axiosWithoutToken.post("/payment/initialize", {
      ...myData,
    });
  }
}

const PaymnetService = new PaymnetsService();
export default PaymnetService;

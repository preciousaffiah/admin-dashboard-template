import { PaymentMetaDataTypeEnum } from "@/types/enums";
import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

class PaymnetsService {
  initPayment(orderId: string, businessId: string, email: string) {
    console.log(orderId, businessId, email);
    
    // payload: { email: string; amount: string }
    const myData = {
      email,
      metadata: {
        type: PaymentMetaDataTypeEnum.ORDER,
        orderId,
        businessId,
      },
    };
    return axiosWithoutToken.post("/payment/initialize", {
      ...myData,
    });
  }
}

const PaymnetService = new PaymnetsService();
export default PaymnetService;

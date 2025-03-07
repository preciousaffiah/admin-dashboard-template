import { StaffService } from "@/services";
import { SDetails } from "@/types";
import { handleAxiosError } from "./axios";

export const updateLogoutStatus = ({
  staffId,
  businessId,
  status,
}: SDetails) => {
  const updateStatus = async () => {
    if (!status) return;
    try {
      const response = await StaffService.updateStaff(staffId, {
        businessId,
        status,
      });

      return response?.data?.data?.data;
    } catch (error: any) {
      //   console.log("error messge:", error?.response?.data?.data?.message);
      handleAxiosError(error, "");
    }
  };
  return updateStatus();
};

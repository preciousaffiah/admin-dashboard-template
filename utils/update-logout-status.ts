import { StaffService } from "@/services";
import { SDetails } from "@/types";

export const updateLogoutStatus = ({
  staffId,
  businessId,
  status }: SDetails
) => {
  const updateStatus = async () => {
    if (!status) return;
    try {
      const response = await StaffService.updateStaff(staffId, {businessId, status});

      return response?.data?.data?.data;
    } catch (error: any) {
    //   console.log("error messge:", error?.response?.data?.data?.message);
      throw new Error(error?.response?.data?.data?.message || "An error occurred");
    }
  };
  return updateStatus()
};
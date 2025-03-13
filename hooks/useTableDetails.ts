import { BusService } from "@/services";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const useTableDetails = (businessId: string, tableNumber: number) => {

  const fetchTableRequest = async () => {
    if (!businessId && !tableNumber) return;
    try {
      const response = await BusService.getTable(
        businessId || "",
        tableNumber
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.log("error messge:",error.response?.data?.message );
      handleAxiosError(error, "");
    }
  };

  return useQuery<any, Error>({
    queryKey: ["table-details", [businessId, tableNumber]],
    queryFn: fetchTableRequest,
  });
};

export default useTableDetails;

import { BusService } from "@/services";
import { BDetails } from "@/types";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const useBusinessDetails = ({ name, id, email }: BDetails) => {
  const fetchBusinessRequest = async () => {
    if (!name && !id && !email) return;
    try {
      const response = await BusService.getBusinessByNameOrIdOrEmail(
        name,
        email,
        id
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.log("error messge:", error.response?.data?.message);
      handleAxiosError(error, "");
    }
  };

  const { isLoading, isError, data } = useQuery<any, Error>({
    queryKey: ["business-details", [name, id, email]],
    queryFn: fetchBusinessRequest,
    enabled: !!(name || id || email), // Only fetch if at least one value is provided
  });

  return {
    isLoading,
    isError,
    data,
  };
};

export default useBusinessDetails;

import { BusService } from "@/services";
import { BDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useBusinessDetails = ({ name, id, email }: BDetails) => {

  const fetchBusinessRequest = async () => {
    if (!name && !id && !email) return;
    try {
      const response = await BusService.getBusinessByNameOrIdOrEmailWithoutAuth(
        name,
        email,
        id
      );

      return response?.data?.data?.data;
    } catch (error: any) {
      console.log("error messge:",error.response?.data?.message );
      throw new Error(error?.response?.data?.message || "An error occurred");
    }
  };

  return useQuery<any, Error>({
    queryKey: ["business-details", [name, id, email]],
    queryFn: fetchBusinessRequest,
  });
};

export default useBusinessDetails;

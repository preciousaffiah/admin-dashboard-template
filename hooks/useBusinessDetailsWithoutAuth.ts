import { BusService } from "@/services";
import { BDetails } from "@/types";
import { handleAxiosError } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const useBusinessDetailsWithoutAuth = ({ name, id, email }: BDetails) => {

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
      handleAxiosError(error, "");
    }
  };

  return useQuery<any, Error>({
    queryKey: ["business-details-withoutauth", [name, id, email]],
    queryFn: fetchBusinessRequest,
  });
};

export default useBusinessDetailsWithoutAuth;

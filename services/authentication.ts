import { axiosWithoutToken } from "@/utils/axios";
import { string } from "zod";

class AuthenticationService {
  login(payload: { email: string; password: string; businessId?: string }) {
    return axiosWithoutToken.post("/auth/login", {
      ...payload,
    });
  }

  // loginCheck(payload: { email: string }) {
  //   return axiosWithoutToken.post("/auth/login", {
  //     ...payload,
  //   });
  // }

  register(payload: {
    fullname: string;
    email: string;
    phone: string;
    password: string;
  }) {
    return axiosWithoutToken.post("/auth/register", {
      ...payload,
    });
  }
}

const AuthService = new AuthenticationService();
export default AuthService;

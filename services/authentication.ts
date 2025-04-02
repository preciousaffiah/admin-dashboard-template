import { axiosWithoutToken } from "@/utils/axios";

class AuthenticationService {
  login(payload: { email: string; password: string; }) {
    return axiosWithoutToken.post("/admin/auth/login", {
      ...payload,
    });
  }
}

const AuthService = new AuthenticationService();
export default AuthService;

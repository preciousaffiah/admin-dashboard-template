import axios from "axios";
import router from "next/router";
import { deleteStore, loadStore } from "./local-storage";
export const baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

export const axiosWithoutToken = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json",
  },
});

export const axiosWithToken = () => {
  let authData: any = loadStore();

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData?.token}`,
    },
  });
};

export const handleAxiosError = (err: any, thunkAPI: any) => {
  const { message, status } = err.toJSON();

  if (status === 401) {
    console.log("403");

    // deleteStore();
    // router.push("/");
  }

  if (status === 403) {
    console.log("403");

    // deleteStore();
    // router.push("/");
  }

  if (message === "Network Error") {
    console.log("netwwork error ooo");

    // throw thunkAPI.rejectWithValue({ //TODO: whats thunkAPI
    //   status: 500,
    //   message: "You are offline", //TODO: chek tthid
    // });
  } else {
    throw new Error(
      err?.response?.data?.message ||
        err?.response?.data?.data?.message ||
        "An error occurred"
    );
    // throw thunkAPI.rejectWithValue({
    //   status: err.response.status || 0,
    //   message: err.response.data.message,
    // });
  }
};

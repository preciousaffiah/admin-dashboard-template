"use client";

import { AuthLayout, WaiterLayout } from "@layouts";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/Logo.png";
import authEmImage from "../../../public/auth-email.png";
import authPwdImage from "../../../public/auth-pwd.png";
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleSignIn } from "@/components/serviette-icons";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared";
import { CircleCheckBig, EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import Container from "@/components/shared/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";

// Define Zod schemas for each step
const formSchema = z
  .object({
    email: z.string().email("invalid email address"),
    businessId: z
      .string()
      .min(1, "required")
      .regex(/^[\w\s]+$/, {
        message: "can only contain letters, numbers, and spaces.",
      }),
    password: z
      .string()
      .min(1, "required")
      .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  })
  .required();

const SignIn: FC = () => {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      businessId: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useAuthToken();

  const router = useRouter();

  const path = usePathname();

  const registerRequest: any = async () => {
    try {
      const response = await AuthService.login(form.getValues());

      return response.data;
    } catch (error: any) {
      console.log(error);

      throw new Error(
        error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "An error occurred"
      );
    }
  };

  const mutation: any = useMutation({
    mutationFn: registerRequest,
    onSuccess: (res: any) => {
      updateUser(res.data.data);
      console.log(res.data.data);
      
      // TODO: conditional routing for admin and staff
      // router.push("/waiter/dashboard");
    },
  });

  const onSubmit = () => mutation.mutate();
  // TODO: turn the form contaier to a component
  return (
    <WaiterLayout title={"Staff sign-in"}>
      <Navbar />
      <Container className={"min-h-[40rem]"}>
        <div className="authcard3 md:min-h-[46rem] md:pt-20 md:pb-16 py-0 lg:px-12 md:px-8 px-0">
          <div className="authcard4">
            <div className="authcard5 md:rounded-xl py-8 rounded-none md:bg-background bg-foreground">
              <div className="md:m-auto lg:px-24 md:px-8 px-4 md:pt-0 pt-6 w-full flex flex-col">
                <Image alt="img" src={logo} className="authimg2 mb-[2.2rem]" />
                <div className="pb-8">
                  <div>
                    <h1 className="md:text-[1.6rem] text-[1.9rem] font-semibold text-txWhite">
                      Sign in to Staff Account
                    </h1>
                    <p className="font-medium text-secondaryBorder">
                      Enter your details
                    </p>
                  </div>
                </div>
                <AnimatePresence>
                  {mutation.isError && (
                    <motion.div
                      initial={{ y: -20, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0.2 }}
                    >
                      <ToastMessage
                        message={
                          mutation?.error?.message ||
                          "An error occured during sign up"
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col m-auto justify-center"
                  >
                    <motion.div
                      initial={{ y: -20, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0.2 }}
                    >
                      <div className="flex flex-col gap-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="grid gap-2 w-full">
                              <FormControl>
                                <input
                                  autoComplete="off"
                                  type="email"
                                  placeholder="email"
                                  {...field}
                                  className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="businessId"
                          render={({ field }) => (
                            <FormItem className="grid gap-2 w-full">
                              <FormControl>
                                <input
                                  autoComplete="off"
                                  type="text"
                                  placeholder="Restaurant/Business Id"
                                  {...field}
                                  className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="grid gap-2 w-full">
                              <FormControl>
                                <div className="flex">
                                  <input
                                    autoComplete="off"
                                    type={`${
                                      showPassword ? "password" : "text"
                                    }`}
                                    placeholder="Password"
                                    {...field}
                                    className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                  />
                                  <EyeOff
                                    onClick={() => {
                                      setShowPassword(!showPassword);
                                    }}
                                    className={`${
                                      showPassword ? "hidden" : "block"
                                    } cursor-pointer w-5 h-5 relative right-4 text-secondaryBorder`}
                                  />
                                  <EyeIcon
                                    onClick={() => {
                                      setShowPassword(!showPassword);
                                    }}
                                    className={`${
                                      showPassword ? "block" : "hidden"
                                    } cursor-pointer w-5 h-5 relative right-4 text-secondaryBorder`}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <br />
                      </div>
                    </motion.div>

                    {form.formState.isValid && mutation.isPending ? (
                      <button className="authbtn flex justify-center items-center bg-[#74901f] gap-x-4">
                        <LoaderCircle className="text-gray-300 w-5 h-5 rotate-icon" />
                        Hold on...
                      </button>
                    ) : (
                      <div className="form-actions md:flex gap-x-3">
                        <button type="submit" className="authbtn">
                          Sign in
                        </button>
                      </div>
                    )}
                  </form>
                </Form>

                <div className="pt-3 text-secondaryBorder text-center text-base">
                  Don't have a user account?&nbsp;
                  <Link href="/waiter/dashboard" className="link">
                    <span className="text-[#8BAE22]">Sign up instead</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="authcard6 md:flex hidden">
              <Image alt="img" src={authPwdImage} className="authimg3" />
            </div>
          </div>
        </div>
      </Container>
    </WaiterLayout>
  );
};

export default SignIn;

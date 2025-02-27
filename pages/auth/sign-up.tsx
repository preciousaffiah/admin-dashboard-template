"use client";

import { GeneralLayout } from "@layouts";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logo.png";
import authEmImage from "../../public/auth-email.png";
import authPwdImage from "../../public/auth-pwd.png";
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleSignIn } from "@/components/serviette-icons";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared";
import { EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import Container from "@/components/shared/container";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";

// Define Zod schemas for each step
const personalDetailsSchema = z.object({
  fullname: z
    .string()
    .min(1, "fullname is required")
    .regex(/^[A-Za-z\s]+$/, {
      message: "can only contain letters.", //revisit
    })
    .trim()
    .regex(/[a-zA-Z]/, {
      message: "must contain at least one letter.",
    })
    .refine((value) => !/\s{2,}/.test(value), {
      message: "contain multiple consecutive spaces.",
    }),
  email: z.string()
  .trim()
  .email("invalid email address"),
  phone: z.string().min(10, "must be at least 10 digits"),
  password: z
    .string()
    .min(6, "must be at least 6 characters")
    .regex(/^\S+$/, { message: "cannot contain whitespace." }),
});

// const paymentDetailsSchema = z.object({
//   cardholderName: z.string().min(1, "Cardholder name is required"),
//   cardNumber: z.string().min(16, "Card number must be 16 digits"),
//   expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date"),
//   cvv: z
//     .string()
//     .min(3, "CVV must be 3 digits")
//     .max(3, "CVV must be 3 digits")
//     .regex(/^\S+$/, { message: "cannot contain whitespace." }),
//   billingAddress: z.string().min(1, "Billing address is required"),
// });

// Combine all schemas into one
const formSchema = z.object({
  personalDetails: personalDetailsSchema,
  // paymentDetails: paymentDetailsSchema,
});

const SignUp: FC = () => {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        fullname: "",
        email: "",
        phone: "",
        password: "",
      },
      // paymentDetails: {
      //   cardholderName: "",
      //   cardNumber: "",
      //   expiry: "",
      //   cvv: "",
      // },
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { updateUser } = useAuthToken();

  const router = useRouter();

  const path = usePathname();

  const registerRequest: any = async () => {
    try {
      const response = await AuthService.register(
        form.getValues().personalDetails
      );

      return response.data;
    } catch (error: any) {
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
      router.push("/");
    },
  });

  const onSubmit = () => mutation.mutate();

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await form.trigger("personalDetails");
    }
    // else if (step === 3) {
    //   isValid = await form.trigger("paymentDetails");
    // }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <GeneralLayout title={"Sign-up"}>
      <Navbar />
      <Container className={"min-h-[40rem]"}>
        <div className="authcard3 md:min-h-[50rem] md:pt-20 md:pb-16 py-0 lg:px-12 md:px-8 px-0">
          <div className="authcard4">
            <div className="authcard5 md:rounded-xl py-8 rounded-none md:bg-background bg-foreground">
              {/* <div className="py-2 px-8 w-full">
                <div className="flex items-center border-dashed border-2 border-l-0 border-r-0 border-primaryGreen h-1 w-full justify-between relative bottom-4">
                  <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
                  <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
                  <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
                </div>
              </div> */}
              <div className="md:m-auto md:px-8 px-4 md:pt-0 pt-6 w-full">
                <Image alt="img" src={logo} className="md:block hidden authimg2 mb-[2.2rem]" />
                <div className="pb-8">
                  <div>
                    <h1 className="md:text-[1.6rem] text-[1.9rem] font-medium text-txWhite">
                      Create Your Account
                    </h1>
                    <p className="font-medium text-secondaryBorder">
                      Enter your details to get started
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
                    className="w-full flex flex-col"
                  >
                    {step === 1 && (
                      <motion.div
                        initial={{ y: -20, opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0.2 }}
                      >
                        <div className="step-content">
                          <h1 className="text-txWhite pb-5 font-medium text-xl">
                            Personal Details
                          </h1>

                          <div>
                            <div className="flex flex-col md:flex-row gap-x-1 md:pb-4 items-baseline">
                              <FormField
                                control={form.control}
                                name="personalDetails.fullname"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Fullname"
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
                                name="personalDetails.email"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="email"
                                        placeholder="Email"
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex flex-col md:flex-row gap-x-1 md:pb-4 items-baseline">
                              <FormField
                                control={form.control}
                                name="personalDetails.phone"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <PhoneInput
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 border-b-[1px] border-primary-border focus:border-b-orange-500 transition-colors duration-500"
                                        placeholder="Mobile Number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="personalDetails.password"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
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
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* {step === 3 && (
                      <motion.div
                        initial={{ y: -20, opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0.2 }}
                      >
                        <div className="step-content">
                          <h1 className="text-txWhite pb-8 font-medium text-xl">
                            Payment Details
                          </h1>

                          <div>
                            <div className="flex flex-col md:flex-row gap-x-1 md:pb-4 items-baseline">
                              <FormField
                                control={form.control}
                                name="paymentDetails.cardholderName"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Card name"
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
                                name="paymentDetails.cardNumber"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Card number"
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex flex-col md:flex-row gap-x-1 md:pb-4 items-baseline">
                              <FormField
                                control={form.control}
                                name="paymentDetails.expiry"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="MM/YY"
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
                                name="paymentDetails.cvv"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="CVV"
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col md:flex-row gap-x-1 items-baseline">
                              <FormField
                                control={form.control}
                                name="paymentDetails.billingAddress"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Billing address"
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <br />
                          </div>
                        </div>
                      </motion.div>
                    )} */}

                    {form.formState.isValid && mutation.isPending ? (
                      <button className="authbtn flex justify-center items-center bg-[#74901f] gap-x-4">
                        <LoaderCircle className="text-gray-300 w-5 h-5 rotate-icon" />
                        Hold on...
                      </button>
                    ) : (
                      <div className="form-actions md:flex gap-x-3">
                        {step > 1 && (
                          <p onClick={prevStep} className="authbtn text-center">
                            Previous
                          </p>
                        )}
                        {/* {step < 2 ? (
                          <p onClick={nextStep} className="authbtn text-center">
                            Next
                          </p>
                        ) : ( */}
                        <button type="submit" className="authbtn">
                          Sign up
                        </button>
                        {/* )} */}
                      </div>
                    )}
                  </form>
                </Form>

                <div className="pt-3 text-secondaryBorder text-center text-base">
                  Have an account?&nbsp;
                  <Link href="/auth/sign-in" className="link">
                    <span className="text-[#8BAE22]">Sign in instead</span>
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
    </GeneralLayout>
  );
};

export default SignUp;

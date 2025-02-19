"use client";

import { AuthLayout, UserLayout, WaiterLayout } from "@layouts";
import Image from "next/image";
import Link from "next/link";
import logo1 from "../../public/Logo.png";
import authPwdImage from "../../public/auth-pwd.png";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleSignIn, Loading } from "@/components/serviette-icons";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared";
import { CircleCheckBig, LoaderCircle } from "lucide-react";
import Container from "@/components/shared/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import ReactFlagsSelect from "react-flags-select";
import { useMutation } from "@tanstack/react-query";
import { useAuthToken } from "@/hooks";
import { BusService } from "@/services";
import { ToastMessage } from "@/components/serviette-ui";

// Define Zod schemas for each step
const restaurantDetailsSchema = z.object({
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .regex(/^[\w\s]+$/, {
      message: "can only contain letters, numbers, and spaces.",
    }), //TODO: revisit to ensure no one passes only white space without any string
  address: z
    .string()
    .min(1, "Address is required")
    .regex(/^[\w\s]+$/, {
      message: "can only contain letters, numbers, and spaces.",
    }), //TODO: revisit to ensure no one passes only white space without any string
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  type: z.enum(["fine dining", "fast food", "cafe", "bar", "other"]), //add field for other
  country: z
    .string()
    .min(1, "Country is required")
    .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  cac: z.string().refine((val) => val.startsWith("data:"), {
    message: "Invalid file format", //TODO: add max file size
  }),
  role: z.enum(["owner", "manager"]),
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
  restaurantDetails: restaurantDetailsSchema,
  // paymentDetails: paymentDetailsSchema,
});

const ResturantSignUp: FC = () => {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantDetails: {
        name: "",
        address: "",
        phone: "",
        email: "",
        role: undefined,
        type: undefined,
        country: "",
        cac: "",
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
  // TODO: add pending business message after rgistrationaa
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [docName, setDocName] = useState("");
  const [success, setSuccess] = useState(false);
  const { updateUser } = useAuthToken();

  const router = useRouter();

  const registerRequest: any = async () => {
    try {
      const response = await BusService.registerBusiness(
        form.getValues().restaurantDetails
      );

      return response.data.data;
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
      setSuccess(true);
    },
  });

  const onSubmit = () => mutation.mutate();

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await form.trigger("restaurantDetails");
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <UserLayout title={"Resturant sign-up"}>
      <Navbar />
      <Container className={"min-h-[40rem] pt-6"}>
        <div className="authcard3 md:min-h-[50rem] md:pt-16 md:pb-16 py-0 lg:px-12 md:px-8 px-0">
          <div className="authcard4">
            <div className="authcard5 md:rounded-xl py-8 rounded-none">
              {success ? (
                <div className="md:px-16 px-6 m-auto">
                  <AnimatePresence>
                    (
                    <motion.div
                      initial={{ y: -20, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0.2 }}
                    >
                      <div className="flex flex-col text-txWhite gap-y-6 items-center">
                        <Loading className="md:size-32 size-24" />
                        <p className="text-center md:max-w-none max-w-[24rem] w-fit">
                          Your business's account is curently under review, you
                          will receive an email in 24 to 72 working hours
                        </p>
                        <p
                          className="py-2 px-4 rounded-md bg-orange-500 cursor-pointer"
                          onClick={() => {
                            router.push("/");
                          }}
                        >
                          Okay
                        </p>
                      </div>
                    </motion.div>
                    )
                  </AnimatePresence>
                </div>
              ) : (
                <div className="md:m-auto md:px-8 px-4 md:pt-0 pt-6 w-full">
                  <Image
                    alt="img"
                    src={logo1}
                    className="authimg2 mb-[2.2rem]"
                  />
                  <div className="pb-8">
                    <div>
                      <h1 className="md:text-[1.6rem] text-[1.9rem] font-semibold text-txWhite">
                        Create Your Business's Account
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
                            <h1 className="text-txWhite pb-3 font-medium text-xl">
                              Restaurant Details
                            </h1>
                            <p className="text-xs text-primary-border font-medium">
                              *Restaurant name should match name on CAC document
                            </p>

                            <div>
                              <div className="flex flex-col md:flex-row gap-x-1 md:pb-3 items-baseline">
                                <FormField
                                  control={form.control}
                                  name="restaurantDetails.name"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <input
                                          autoComplete="off"
                                          type="text"
                                          placeholder="Restaurant name"
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
                                  name="restaurantDetails.email"
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

                              <div className="flex flex-col md:flex-row gap-x-1 md:pb-3 items-baseline">
                                <FormField
                                  control={form.control}
                                  name="restaurantDetails.phone"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <PhoneInput
                                          className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                  name="restaurantDetails.address"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <input
                                          autoComplete="off"
                                          type="text"
                                          placeholder="address"
                                          {...field}
                                          className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="flex flex-col md:flex-row gap-x-1 md:pb-3 items-baseline">
                                <FormField
                                  control={form.control}
                                  name="restaurantDetails.type"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <select
                                          {...field}
                                          className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                        >
                                          <option
                                            value="none"
                                            selected
                                            disabled
                                            hidden
                                          >
                                            Select restaurant type
                                          </option>
                                          <option value="fine dining">
                                            fine dining
                                          </option>
                                          <option value="fast food">
                                            fast food
                                          </option>
                                          <option value="cafe">cafe</option>
                                          <option value="bar">bar</option>
                                          <option value="other">other</option>
                                        </select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="restaurantDetails.country"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <ReactFlagsSelect
                                          selected={selectedCountry}
                                          onSelect={(code) => {
                                            setSelectedCountry(code);
                                            field.onChange(code);
                                          }}
                                          searchable
                                          className="md:pt-0 pt-4 text-[0.98rem] rounded-none w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                  name="restaurantDetails.cac"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <input
                                          type="file"
                                          accept=".pdf,.doc,.docx"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const base64 =
                                                  reader.result as string; // Get the base64 string
                                                field.onChange(base64); // Update the form state with the base64 string
                                                setDocName(file.name);
                                              };
                                              reader.readAsDataURL(file); // Convert the file to base64
                                            }
                                          }}
                                          placeholder="Upload CAC document"
                                          className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                        />
                                      </FormControl>
                                      <p className="text-xs text-primary-border font-medium">
                                        *Upload CAC document
                                      </p>

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {docName && (
                                  <p className="text-txWhite text-sm">
                                    Selected file: {docName}
                                  </p>
                                )}
                                <FormField
                                  control={form.control}
                                  name="restaurantDetails.role"
                                  render={({ field }) => (
                                    <FormItem className="grid gap-2 md:w-1/2 w-full">
                                      <FormControl>
                                        <select
                                          {...field}
                                          className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                        >
                                          <option
                                            value="none"
                                            selected
                                            disabled
                                            hidden
                                          >
                                            Select your role
                                          </option>
                                          <option value="owner">owner</option>
                                          <option value="manager">
                                            manager
                                          </option>
                                        </select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {form.formState.isValid && mutation.isPending ? (
                        <button className="authbtn flex justify-center items-center bg-[#74901f] gap-x-4">
                          <LoaderCircle className="text-gray-300 w-5 h-5 rotate-icon" />
                          Hold on...
                        </button>
                      ) : (
                        <div className="form-actions md:flex gap-x-3">
                          {step > 1 && (
                            <p
                              onClick={prevStep}
                              className="authbtn text-center"
                            >
                              Previous
                            </p>
                          )}
                          {/* {step < 2 ? (
                        <p onClick={nextStep} className="authbtn text-center">
                          Next
                        </p>
                      ) : ( */}
                          <button type="submit" className="authbtn">
                            Sign Up Business
                          </button>
                          {/* )} */}
                        </div>
                      )}
                    </form>
                  </Form>

                  <div className="pt-3 text-secondaryBorder text-center text-base">
                    <Link href="/auth/staff/sign-in" className="link">
                      <span className="text-[#8BAE22]">
                        Sign in as staff instead
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="authcard6 md:flex hidden">
              <Image alt="img" src={authPwdImage} className="authimg3" />
            </div>
          </div>
        </div>
      </Container>
    </UserLayout>
  );
};

export default ResturantSignUp;

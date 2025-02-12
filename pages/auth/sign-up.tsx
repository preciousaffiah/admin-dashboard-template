"use client";

import { AuthLayout } from "@layouts";
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

// Define Zod schemas for each step
const personalDetailsSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .regex(/^[\w\s]+$/, {
      message: "can only contain letters, numbers, and spaces.", //revisit
    }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "must be at least 10 digits"),
  password: z
    .string()
    .min(6, "must be at least 6 characters")
    .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  role: z.enum(["owner", "manager"]),
});

const restaurantDetailsSchema = z.object({
  restaurantName: z
    .string()
    .min(1, "Restaurant name is required")
    .regex(/^[\w\s]+$/, {
      message: "can only contain letters, numbers, and spaces.",
    }), //TODO: revisit to ensure no one passes only white space without any string
  address: z
    .string()
    .min(1, "Address is required")
    .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  type: z.enum(["fine dining", "fast food", "cafe", "bar", "other"]), //add field for other
  country: z
    .string()
    .min(1, "Country is required")
    .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  cacDocument: z.string().refine((val) => val.startsWith("data:"), {
    message: "Invalid file format",
  }),
  cacDocumentName: z.string().optional(),
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
  restaurantDetails: restaurantDetailsSchema,
  // paymentDetails: paymentDetailsSchema,
});

const SignUp: FC = () => {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: undefined,
      },
      restaurantDetails: {
        restaurantName: "",
        address: "",
        phone: "",
        email: "",
        type: undefined,
        country: "",
        cacDocument: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const router = useRouter();

  const path = usePathname();

  const onSubmit = (data: any) => {
    setIsLoading(true);
    console.log("Form data submitted:", data);
    setTimeout(() => {
      console.log("...where password check aapi comes in");
      // setSuccess(true);
      setIsLoading(false);

      // return router.push("/auth/start");
    }, 2000);
  };

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await form.trigger("personalDetails");
    } else if (step === 2) {
      isValid = await form.trigger("restaurantDetails");
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
    <AuthLayout title={"Sign-up"}>
      <Navbar />
      <Container className={"min-h-[40rem] pt-6"}>
        <div className="authcard3 md:min-h-[50rem] md:pt-16 md:pb-16 py-0 lg:px-12 md:px-8 px-0">
          <div className="authcard4">
            <div className="authcard5 md:rounded-xl py-8 rounded-none">
              {/* <div className="py-2 px-8 w-full">
                <div className="flex items-center border-dashed border-2 border-l-0 border-r-0 border-primary-green h-1 w-full justify-between relative bottom-4">
                  <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
                  <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
                  <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
                </div>
              </div> */}
              <div className="md:m-auto md:px-8 px-4 md:pt-0 pt-6 w-full">
                <Image alt="img" src={logo} className="authimg2 mb-[2.2rem]" />
                <div className="pb-8">
                  <div>
                    <h1 className="md:text-[1.6rem] text-[1.9rem] font-semibold text-white">
                      Create Your Account
                    </h1>
                    <p className="font-medium text-secondary-border">
                      Enter your details to get started
                    </p>
                  </div>
                </div>
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
                          <h1 className="text-white pb-5 font-medium text-xl">
                            Personal Details
                          </h1>

                          <div>
                            <div className="flex flex-col md:flex-row gap-x-1 md:pb-4 items-baseline">
                              <FormField
                                control={form.control}
                                name="personalDetails.fullName"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Fullname"
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 border-b-[1px] border-primary-border focus:border-b-orange-500 transition-colors duration-500"
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
                                name="personalDetails.role"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <select
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        <option value="manager">manager</option>
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="personalDetails.password"
                              render={({ field }) => (
                                <FormItem className="grid gap-2 md:w-1/2">
                                  <FormControl>
                                    <input
                                      autoComplete="off"
                                      type="text"
                                      placeholder="Password"
                                      {...field}
                                      className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <br />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ y: -20, opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0.2 }}
                      >
                        <div className="step-content">
                          <h1 className="text-white pb-3 font-medium text-xl">
                            Restaurant Details
                          </h1>
                          <p className="text-xs text-primary-border font-medium">
                            *Restaurant name should match name on CAC document
                          </p>

                          <div>
                            <div className="flex flex-col md:flex-row gap-x-1 md:pb-3 items-baseline">
                              <FormField
                                control={form.control}
                                name="restaurantDetails.restaurantName"
                                render={({ field }) => (
                                  <FormItem className="grid gap-2 md:w-1/2 w-full">
                                    <FormControl>
                                      <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Restaurant name"
                                        {...field}
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                name="restaurantDetails.cacDocument"
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
                                              form.setValue(
                                                "restaurantDetails.cacDocumentName",
                                                file.name
                                              ); // Update the form state with the file name
                                            };
                                            reader.readAsDataURL(file); // Convert the file to base64
                                          }
                                        }}
                                        placeholder="Upload CAC document"
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                                      />
                                    </FormControl>
                                    <p className="text-xs text-primary-border font-medium">
                                      *Upload CAC document
                                    </p>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {form.watch(
                                "restaurantDetails.cacDocumentName"
                              ) && (
                                <p className="text-white text-sm">
                                  Selected file:{" "}
                                  {form.watch(
                                    "restaurantDetails.cacDocumentName"
                                  )}
                                </p>
                              )}
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
                          <h1 className="text-white pb-8 font-medium text-xl">
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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
                                        className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-white w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
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

                    {isLoading ? (
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
                        {step < 2 ? (
                          <p onClick={nextStep} className="authbtn text-center">
                            Next
                          </p>
                        ) : (
                          <button type="submit" className="authbtn">
                            Sign up
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                </Form>

                <div className="pt-3 text-secondary-border text-center text-base">
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
    </AuthLayout>
  );
};

export default SignUp;

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput from "react-phone-number-input";

import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { StaffService } from "@/services";
import { useAuthToken } from "@/hooks";
import { ToastMessage } from "@/components/serviette-ui";
import { handleMediaUpload } from "@/utils/upload";
import "react-phone-number-input/style.css";
import { handleAxiosError } from "@/utils/axios";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 4) / 3);

const formSchema = z
  .object({
    email: z.string().email("invalid email address"),
    businessId: z.string(),
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
    phone: z.string().min(10, "must be at least 10 digits"),
    department: z.enum(["kitchen", "waiter", "bar"]), //add field for other
    image: z
      .string()
      .refine((val) => val.startsWith("data:"), {
        message: "Invalid file format",
      })
      .refine((val) => val.length <= MAX_BASE64_LENGTH, {
        message: "File size must be less than 4MB.",
      }), //TODO: add width and height
    password: z
      .string()
      .min(6, "must be at least 6 characters")
      .regex(/^\S+$/, { message: "cannot contain whitespace." }),
  })
  .required();

const AddStaffModal = ({ success, setSuccess }: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullname: "",
      phone: "",
      department: undefined,
      image: "",
      password: "",
      businessId: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const [showPassword, setShowPassword] = useState(false);
  const { userData } = useAuthToken();
  const addStaffRequest: any = async () => {
    form.setValue("businessId", userData?.businessId || "");

    try {
      const response = await StaffService.addStaff(form.getValues());

      return response.data;
    } catch (error: any) {
      handleAxiosError(error, "");
    }
  };

  const mutation: any = useMutation({
    mutationFn: addStaffRequest,
    onSuccess: (res: any) => {
      setSuccess(true);
      form.reset();
    },
  });

  const onSubmit = () => mutation.mutate();

  return (

    <DialogContent className="sm:max-w-[425px] text-black">
      {success ? (
        <div className="flex flex-col justify-center items-center">
          <video
            className="w-28 h-24"
            src="/svg.mp4" // Place the MP4/WebM file in "public"
            autoPlay
            muted
            playsInline
          />
          <p>Staff added successfully</p>
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Add a staff</DialogTitle>
            <DialogDescription className="text-xs">
              Please fill in details of your new staff.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
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
                        "An error occured during process"
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-y-1"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-x-3 items-center pb-2">
                          <p>Email</p>
                          <FormControl>
                            <input
                              autoComplete="off"
                              type="text"
                              placeholder="staff email"
                              {...field}
                              className="py-1.5 px-3 md:text-sm rounded-md w-full border-[1px] border-primary-border focus:border-orange-500 outline-none transition-colors duration-500"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-x-3 items-center pb-2">
                          <p>Fullname</p>
                          <FormControl>
                            <input
                              autoComplete="off"
                              type="text"
                              placeholder="staff fullname"
                              {...field}
                              className="py-1.5 px-3 md:text-sm rounded-md w-full border-[1px] border-primary-border focus:border-orange-500 outline-none transition-colors duration-500"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <div 
                        className="flex gap-x-3 items-center pb-2"
                        >
                          <p>Phone</p>
                          <FormControl>
                            <PhoneInput
                              className="md:pt-0 pt-4 w-full rounded-none text-txWhite mt-1 border-b-[1px] border-primary-border focus:border-b-orange-500 transition-colors duration-500"
                              placeholder="Mobile Number"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-x-3 items-center pb-2">
                          <p>Department</p>

                          <FormControl>
                            <select
                              {...field}
                              className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                            >
                              <option value="none" selected disabled hidden>
                                Select staff department
                              </option>
                              <option value="bar">bar</option>
                              <option value="waiter">waiter</option>
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className=" gap-x-3 items-center pb-2">
                        <FormControl>
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp"
                            onChange={(e) => {
                              handleMediaUpload(e, field);
                            }}
                            placeholder="Upload image"
                            className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                          />
                        </FormControl>
                        <p className="text-xs text-primary-border font-medium">
                          *Upload image
                        </p>

                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="">
                        <div className="flex gap-x-3 items-center">
                          <p>Password</p>
                          <FormControl>
                            <div className="flex w-full pb-3">
                              <input
                                autoComplete="off"
                                type={`${showPassword ? "password" : "text"}`}
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
                        </div>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <button
                      type="submit"
                      className="flex gap-x-1 items-center self-end bg-primary-orange rounded-md w-fit text-white px-3 py-1.5 text-sm font-medium"
                    >
                      Add
                      {form.formState.isValid && mutation.isPending && (
                        <LoaderCircle className="text-white w-4 rotate-icon" />
                      )}
                    </button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </div>
        </>
      )}
    </DialogContent>
  );
};

export default AddStaffModal;

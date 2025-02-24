import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const MAX_BASE64_LENGTH = Math.floor((MAX_FILE_SIZE * 1) / 2);

const formSchema = z
  .object({
    email: z.string().email("invalid email address"),
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
    department: z.enum(["kitchen", "waiter", "bar"]), //add field for other
    image: z
      .string()
      .refine((val) => val.startsWith("data:"), {
        message: "Invalid file format",
      })
      .refine((val) => val.length <= MAX_BASE64_LENGTH, {
        message: "File size must be less than 2MB.",
      }),
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
      department: undefined,
      image: "",
      password: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: any) => {
    setSuccess(true);
    form.reset();
  };

  return (
    <DialogContent className="sm:max-w-[425px] text-black">
      {success ? (
        <div className="flex flex-col justify-center items-center">
          <video
            className="w-40 h-36"
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-y-3"
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
                              className="py-1.5 px-3 text-sm rounded-md w-full border-[1px] border-primary-border focus:border-orange-500 outline-none transition-colors duration-500"
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
                              className="py-1.5 px-3 text-sm rounded-md w-full border-[1px] border-primary-border focus:border-orange-500 outline-none transition-colors duration-500"
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
                              <option value="kitchen">kitchen</option>
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
                            accept=".png,.jpg,.jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64 = reader.result as string; // Get the base64 string
                                  field.onChange(base64); // Update the form state with the base64 string
                                };
                                reader.readAsDataURL(file); // Convert the file to base64
                              }
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
                      className="self-end bg-primary-orange rounded-md w-fit text-white px-3 py-1.5 text-sm font-medium"
                    >
                      Add
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

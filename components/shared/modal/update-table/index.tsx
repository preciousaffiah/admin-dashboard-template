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

import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { BusService } from "@/services";
import { ToastMessage } from "@/components/serviette-ui";
import "react-phone-number-input/style.css";
import { handleAxiosError } from "@/utils/axios";

const formSchema = z
  .object({
    businessId: z.string(),
    tableId: z.string(),
    tableNumber: z.string(),
    status: z.enum(["available", "occupied"]),
  })
  .required();

const UpdateTableModal = ({
  success,
  setSuccess,
  tableId,
  tableNumber,
  businessId,
}: {
  success: boolean;
  setSuccess: any;
  tableId: string;
  tableNumber: string;
  businessId: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: undefined,
      tableId: "",
      tableNumber: "",
      businessId: "",
    },
    mode: "onChange", // Ensures validation checks on each change
  });

  const addStaffRequest: any = async () => {
    form.setValue("businessId", businessId);
    form.setValue("tableId", tableId);
    form.setValue("tableNumber", String(tableNumber));

    try {
      const response = await BusService.updateTable(form.getValues());

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
          <p>Table Updated successfully</p>
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Update table status</DialogTitle>
            <DialogDescription className="text-xs">
              Please fill in details of your table.
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-x-3 items-center pb-2">
                          <p>Status</p>

                          <FormControl>
                            <select
                              {...field}
                              className="md:pt-0 pt-4 text-[0.98rem] rounded-none text-txWhite w-full mt-1 bg-transparent border-b-[1px] border-primary-border focus:border-b-orange-500 outline-none transition-colors duration-500"
                            >
                              <option value="none" selected disabled hidden>
                                Select table status
                              </option>
                              <option value="available">available</option>
                              <option value="occupied">occupied</option>
                            </select>
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
                      Update
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

export default UpdateTableModal;

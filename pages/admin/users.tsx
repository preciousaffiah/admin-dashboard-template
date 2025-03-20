import Link from "next/link";
import React, { FC, useState } from "react";
import { Modal } from "@/components/shared";
import Container from "@/components/shared/container";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/types";
import Image from "next/image";
import orderImg from "public/orderimg.png";
import orderImg2 from "public/auth-email.png";
import { handleRowClick } from "@/utils/modal";
import Sidebar from "@/components/shared/nav/sidebar/admin";
// import gif from "../../public/svg.mp4";
import { Circle, Mail, Phone, Plus, X } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import AdminUsersTable from "@/components/shared/admin/table/users";
import { AdminLayout, GeneralLayout } from "@layouts";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddStaffModal from "@/components/shared/modal/add-staff";
import avatar from "public/avatar.png";

const tabHeaders = {
  all: "all",
  admin: "admins",
  waiter: "waiters",
  bar: "bartenders",
};
const defaultInvoice: User = {
  _id: "",
  fullname: "",
  email: "",
  image: "",
  department: "",
  phone: "",
  Date: "",
  status: "",
  Requests: 0,
  Completed: 0,
  Sales: 0,
};
const tableHeaders = [
  "S/N",
  "Users",
  "Email Address",
  "Department",
  "Phone Number",
  "Date Added",
  "Status",
];

const Users: FC = () => {
  const [view, setView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orderHeader, setOrderHeader] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<User>(defaultInvoice);

  const [success, setSuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [tabKey, setTabKey] = useState<string>("");

  let title = "User Management";

  const updatedInvoice = { ...selectedInvoice };

  return (
    <AdminLayout title={title}>
      <div className="flex justify-end h-screen w-full">
        <Container>
          <div className="authcard3 h-fit lg:px-12 md:px-8 px-0">
            <div className="w-full bg-primaryDark pt-4 rounded-md">
              <div className="w-full h-full">
                <div className="px-3 flex md:justify-between justify-start pb-4 border-b border-primary-border">
                  <div className="flex items-center">
                    <h1 className="md:block hidden capitalize font-semibold text-txWhite text-xl">
                      All Staffs
                    </h1>
                  </div>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <p
                          onClick={() => {
                            setSuccess(false);
                          }}
                          className="cursor-pointer flex bg-primaryGreen text-black rounded-md items-center gap-x-1 w-fit m-0 px-2 py-2 text-sm font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                          Add Staff
                        </p>
                      </DialogTrigger>
                      <AddStaffModal
                        success={success}
                        setSuccess={setSuccess}
                      />
                    </Dialog>
                  </div>
                </div>

                <AdminUsersTable
                  view={view}
                  tabHeaders={tabHeaders}
                  tableHeaders={tableHeaders}
                  setIsOpen={setIsOpen}
                  setSelectedInvoice={setSelectedInvoice}
                  selectedInvoice={selectedInvoice}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  tabKey={tabKey}
                  setTabKey={setTabKey}
                  handleRowClick={handleRowClick}
                />
              </div>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div>
                <div className="border-b-[0.3px] border-b-primary-border -border">
                  <div className="px-3">
                    <div className="flex justify-between rounded-xl px-2 items-center bg-selectedRow h-16 text-txWhite">
                      <div className="flex flex-col h-full justify-center gap-y-3">
                        <p className="md:text-xl text-lg font-medium">
                          User Details
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-center">
                          <p
                            className={`capitalize text-txWhite font-medium status-cancelled text-center  flex items-center rounded-xl py-[0.1rem] px-3 w-fit`}
                          >
                            {selectedInvoice.department}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="my-2 md:mb-3 md:mt-8 flex justify-center px-2 items-center text-txWhite">
                      <div className="gap-y-3 flex flex-col h-full justify-center text-secondaryBorder">
                        <div className="w-36 h-36 m-auto">
                          <img
                            src={`${selectedInvoice.image || avatar.src}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="w-full flex flex-col text-center">
                          <p className="text-2xl font-medium capitalize text-txWhite">
                            {selectedInvoice.fullname}
                          </p>
                          <p className="text-sm">{selectedInvoice.email}</p>
                        </div>
                        <div className="flex w-full gap-x-2 justify-center">
                          <Phone className="w-8 h-8 py-2 px-1 rounded-full bg-foreground text-secondaryBorder" />
                          <Mail className="w-8 h-8 py-2 px-1 rounded-full bg-foreground text-secondaryBorder" />
                        </div>
                        <div>
                          <p className="m-auto flex bg-primaryGreen rounded-md text-background items-center 1 w-fit px-6 py-2 text-sm font-semibold">
                            Full Profile
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex py-2 px-4">
                    <div className="w-full">
                      <div className="text-txWhite justify-between w-full flex px-0 gap-x-4">
                        <h1 className="">User Summary</h1>
                        {/* <h1 className="text-xs font-medium text-primaryGreen">
                          See All
                        </h1> */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <div className="flex justify-between p-3 items-center border-t border-primary-border text-txWhite">
                          <div className="capitalize flex flex-col gap-y-3 w-full">
                            <div className="flex justify-between">
                              <p>Department</p>
                              <p className="text-txWhite">
                                {selectedInvoice.department}{" "}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p>Phone Number</p>
                              <p>
                                {`${
                                  !selectedInvoice.phone
                                    ? "nill"
                                    : selectedInvoice.phone
                                }`}{" "}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p>Orders Completed</p>
                              <p>{selectedInvoice.Completed} </p>
                            </div>
                            <div className="flex justify-between">
                              <p>Sales</p>
                              <p>₦{selectedInvoice.Sales} </p>
                            </div>
                            <div className="flex justify-between">
                              <p>Status</p>
                              <p
                                className={`capitalize text-sm status-${selectedInvoice.status} text-center  flex items-center rounded-xl py-[0.1rem] px-2 w-fit`}
                              >
                                {selectedInvoice.status}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div>
                        <div className="border-t border-primary-border flex flex-col py-4 px-4">
                          <div className="w-full">
                            <div className="text-txWhite justify-between items-center w-full flex px-0 pb-4 gap-x-4">
                              <h1 className="flex gap-x-2">
                                Open Tasks{" "}
                                <span className="font-semibold border border-primary-orange py-[0.1rem] px-1 text-sm rounded-md text-primary-orange">
                                  10
                                </span>
                              </h1>
                              <h1 className="text-xs font-medium text-primaryGreen">
                                See All
                              </h1>
                            </div>
                          </div>
                          <div className="border-l-4 px-1 border-primaryGreen text-secondaryBorder items-end flex justify-between">
                            <div className="text-sm">
                              <p> Upcoming</p>
                              <p className="text-base font-medium text-txWhite">
                                {" "}
                                Review with manager
                              </p>
                              <div className="flex items-center gap-x-1">
                                <Clock className="w-4 h-4" />
                                <p> 6:30pm-8:00pm</p>
                              </div>
                            </div>
                            <button className="text-secondaryBorder h-fit flex rounded-xl transparent-btn p-2 ">
                              Send Reminder
                            </button>
                          </div>
                        </div>
                      </div> */}
                      {/* <div>
                        <div className="flex justify-between p-3 items-center border-t border-primary-border">
                          <div className=" w-full text-white">
                            <div className="flex justify-between">
                              <button className="m-auto flex rounded-xl bg-cancel p-2 ">
                                <X /> Delete Staff
                              </button>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </Container>
      </div>
    </AdminLayout>
  );
};

export default Users;

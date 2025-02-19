import { AuthLayout } from "@layouts";
import Link from "next/link";
import React, { FC } from "react";
import { MainNavbar } from "@/components/shared";
import { ChevronRight } from "lucide-react";
import Container from "@/components/shared/container";
import { useAuthToken } from "@/hooks";

const name = "Victoria";
let title = "Start";

const Start: FC = () => {
  const { userData } = useAuthToken();

  return (
    // <AuthLayout title={title}>
    <>
      <MainNavbar title={"Welcome"} />
        <Container className={"min-h-[40rem]"}>
          <div className="authcard3 md:pt-24 md:pb-16 py-0 md:px-7 px-0">
            <div className="authcard4">
              <div className="md:w-1/2 w-full h-full bg-primaryDark z-50 rounded-xl">
                <div className="text-txWhite gap-y-12 flex flex-col justify-center items-center h-full">
                  <div className="text-center flex flex-col gap-y-5">
                    <h2 className="font-semibold text-2xl">Welcome, {userData?.fullname}!</h2>
                    <p className="">What would you like to do?</p>
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <Link
                      href="#"
                      className="font-medium rounded-[7px] justify-center items-center p-2 text-center w-full border-[0.3px] bg-primaryGreen text-black hover:bg-transparent border-primary-border hover:text-secondaryBorder flex gap-x-2 transition-colors duration-500"
                    >
                      Setup my Organisation
                    </Link>
                    <Link
                      href="#"
                      className="font-medium rounded-[7px] justify-center items-center p-2 text-center w-full bg-transparent hover:bg-primaryGreen hover:text-black border-[0.3px] border-primary-border text-secondaryBorder flex gap-x-2 transition-colors duration-500"
                    >
                      Continue without Setup
                      <ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
    {/* </AuthLayout> */}
    </>
  );

};

export default Start;

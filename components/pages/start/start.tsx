import { GeneralLayout } from "@layouts";
import Link from "next/link";
import React, { FC } from "react";
import { MainNavbar, Navbar } from "@/components/shared";
import { ChevronRight } from "lucide-react";
import Container from "@/components/shared/container";
import { useAuthToken } from "@/hooks";

const name = "Victoria";
let title = "Start";

const Start: FC = () => {
  const { userData } = useAuthToken();

  return (
    <>
      <Navbar />
      <div className="pattern md:h-[40rem] h-[30rem] w-full px-4 cover">
        <div className="m-auto h-full flex flex-col justify-center lg:text-8xl md:text-7xl sm:text-5xl text-4xl font-edu capitalize font-medium text-white">
          <p className="lg:text-[7.5rem] md:text-[6.5rem] sm:text-[4.5rem] text-[3rem] uppercase">
            Servlette
          </p>
          <p>
            good
            <span className="word">drink</span>
            <span className="word">food</span>
            <span className="word">life</span>
          </p>
        </div>
      </div>
      {/* </GeneralLayout> */}
    </>
  );
};

export default Start;

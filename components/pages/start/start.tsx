import { GeneralLayout } from "@layouts";
import Link from "next/link";
import React, { FC } from "react";
import { MainNavbar, Navbar } from "@/components/shared";
import {
  Beer,
  ChevronRight,
  Coffee,
  Pizza,
  UtensilsCrossed,
} from "lucide-react";
import Container from "@/components/shared/container";
import { useAuthToken } from "@/hooks";
import bartender from "public/bartender.jpg";
import analytics from "public/analytics.png";
import menu from "public/menu.png";
import notification from "public/notification.jpg";
import qr from "public/qr.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const name = "Victoria";
let title = "Start";

const Start: FC = () => {
  const { userData } = useAuthToken();
  const array1 = [
    {
      title: "Bars & Clubs ",
      description: "Handle drink orders, reservations, & staff efficiently.",
      tag: Beer,
    },
    {
      title: "Restaurants",
      description: "Manage tables, track orders, and boost revenue.",
      tag: UtensilsCrossed,
    },
  ];

  const array2 = [
    {
      title: "Cafés",
      description: "Streamline customer orders & optimize workflow.",
      tag: Coffee,
    },
    {
      title: "Fast Foods",
      description: "Handle drink orders, reservations, & staff efficiently.",
      tag: Pizza,
    },
  ];

  const features1 = [
    {
      title: "Smart Order Management",
      description: "Streamline customer orders & optimize workflow.",
      image: analytics,
    },
    {
      title: "Sales Reports & Analytics",
      description: "Get analytics and reports to boost profits.",
      image: analytics,
    },
    {
      title: "Menu Customization",
      description: "Update digital menus instantly across locations.",
      image: menu,
    },
  ];

  const features2 = [
    {
      title: "Alerts System ",
      description:
        'Staff receives notifications when a customer requests service- "Nudge waiter" and places order.',
      image: notification,
    },
    {
      title: "QR Code Generation",
      description:
        "Quick generation of unique QR code for each table where customers scan for menu, order and attention.",
      image: qr,
    },
  ];

  return (
    <div className="bg-white">
      <Navbar />
      <div className="flex flex-col items-center gap-y-14 pb-8">
        <div className="pattern md:h-[35rem] h-[30rem] w-full px-4">
          <div className="text-center text-black m-auto h-full flex flex-col justify-center  font-edu capitalize font-medium ">
            <p className="lg:text-[7.5rem] md:text-[6.5rem] sm:text-[4.5rem] text-[3rem] uppercase">
              Servlette
            </p>

            <div className="w-[64rem]">
              <p className="text-5xl m-auto text-center">
                All-in-One Management for
                <span className="word">Bars</span>
                <span className="word">Restaurants</span>
                <span className="word">Cafés & More!</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-center gap-x-2">
            <Image
              src={bartender}
              alt="img"
              className="w-[20rem] h-[15rem] object-cover rounded-md"
            />
            <Image
              src={bartender}
              alt="img"
              className="w-[20rem] h-[15rem] object-cover rounded-md"
            />
          </div>
          <Image
            src={bartender}
            alt="img"
            className="w-full h-[15rem] object-cover rounded-md"
          />
        </div>
        <div className="m-auto flex flex-col justify-center items-center">
          <Link
            href="#"
            className="w-fit p-2 text-primaryDark rounded-md bg-primary-orange font-semibold"
          >
            Start Your Free Trial
          </Link>
        </div>
        <div className="text-black">
          <h1 className="font-semibold text-4xl text-center">
            Who Is Servlette For?{" "}
          </h1>
          <div className="pt-8 flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              {array1.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 bg-secondaryDark cursor-pointer hover:px-7 hover:bg-[#c8cccc] duration-500 transition-all px-4 py-6 rounded-lg"
                >
                  <item.tag className="size-7" />
                  <div>
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-x-4">
              {array2.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 bg-secondaryDark cursor-pointer hover:px-7 hover:bg-[#c8cccc] duration-500 transition-all px-4 py-6 rounded-lg"
                >
                  <item.tag className="size-7" />
                  <div>
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-black">
          <h1 className="font-semibold text-4xl text-center">Key Features </h1>
          <div className="pt-8 flex flex-col gap-y-4 px-20">
            <div className="flex gap-x-4 m-auto">
              {features1.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 bg-secondaryDark cursor-pointer hover:px-4 hover:bg-[#c8cccc] duration-500 transition-all px-2 py-6 rounded-lg"
                >
                  <Image
                    src={item.image}
                    alt="img"
                    className="w-[10rem] h-[7rem] object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-x-4">
              {features2.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 bg-secondaryDark cursor-pointer hover:px-4 hover:bg-[#c8cccc] duration-500 transition-all px-2 py-6 rounded-lg"
                >
                  <Image
                    src={item.image}
                    alt="img"
                    className="w-[10rem] h-[7rem] object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-black">
          <h1 className="font-semibold text-4xl text-center">
            {" "}
            How It Works (Step-by-Step Guide)
          </h1>
          <div className="pt-8 flex flex-col gap-y-4 px-20">
            <div className="flex gap-x-4 m-auto">
              <Image
                src={bartender}
                alt="img"
                className="w-[50rem] h-[25rem] object-cover rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="m-auto flex flex-col justify-center items-center">
          <Link
            href="#"
            className="w-fit p-2 text-primaryDark rounded-md bg-primary-orange font-semibold"
          >
            Try Servlette for Free
          </Link>
        </div>
        
      </div>
      {/* </GeneralLayout> */}
    </div>
  );
};

export default Start;

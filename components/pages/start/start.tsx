import { GeneralLayout } from "@layouts";
import Link from "next/link";
import React, { FC } from "react";
import { MainNavbar, Navbar } from "@/components/shared";
import {
  Beer,
  ChevronRight,
  Coffee,
  Facebook,
  Instagram,
  Pizza,
  Twitter,
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
      title: "Menu Customization",
      description: "Update digital menus instantly across locations.",
      image: menu,
    },
    {
      title: "Sales Reports & Analytics",
      description: "Get analytics and reports to boost profits.",
      image: analytics,
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
    {
      title: "Alerts System ",
      description:
        'Staff receives notifications when a customer requests service- "Nudge waiter" and places order.',
      image: notification,
    },
  ];

  return (
    <div className="bg-white">
      <Navbar />
      <div className="flex flex-col items-center md:gap-y-16 gap-y-10">
        <div className="pattern lg:h-[35rem] md:h-[25rem] h-[25rem] w-full px-4">
          <div className="md:text-center text-black m-auto h-full flex flex-col justify-center font-edu capitalize font-medium ">
            <p className="font-semibold lg:text-[7.5rem] md:text-[6.5rem] sm:text-[4.5rem] text-[2rem] uppercase">
              Servlette
            </p>

            <div className="md:w-[64rem] w-full">
              <div className="flex md:flex-row flex-col lg:text-5xl md:text-3xl text-2xl md:justify-center md:text-center">
                <p>All-in-One Management</p>
                <div>
                  <span className="md:pl-3 pl-0"> for</span>
                  <span className="word">Bars</span>
                  <span className="word">Restaurants</span>
                  <span className="word">Cafés & More!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full text-center m-auto text-primary py-8 md:px-28 px-4 flex flex-col gap-y-3">
          <h1 className="font-medium lg:text-4xl text-3xl font-edu">
            The Smart Way to Manage Your Business
          </h1>
          <p className="text-lg md:w-[70%] text-center m-auto w-full">
            Servlette takes the hassle out of the process, giving you a
            seamless, all-in-one platform to manage everything effortlessly.
            With Servlette, you’re not just managing your business—you’re
            elevating the customer experience and improving efficiency.
          </p>
        </div>
        <div className="flex flex-col gap-y-3 md:w-[75%] w-full px-4">
          <div className="flex md:flex-row flex-col justify-center md:gap-y-0 gap-y-3 gap-x-2">
            <Image
              src={bartender}
              alt="img"
              className="w-full md:h-[15rem] h-[8rem] object-cover rounded-md"
            />
            <Image
              src={bartender}
              alt="img"
              className="w-full md:h-[15rem] h-[8rem] object-cover rounded-md"
            />
          </div>
          <Image
            src={bartender}
            alt="img"
            className="w-full md:h-[15rem] h-[8rem] object-cover rounded-md"
          />
        </div>
        <div className="m-auto flex flex-col justify-center items-center">
          <Link
            href="#"
            className="w-fit px-3 py-2 text-primaryDark rounded-md bg-primary-orange font-semibold"
          >
            Start Your Free Trial
          </Link>
        </div>
        <div className="text-black">
          <h1 className="md:font-semibold font-medium lg:text-4xl text-3xl text-center font-edu">
            Who Is Servlette For?
          </h1>
          <div className="pt-8 px-4 flex flex-col gap-y-4 w-full">
            <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-3 gap-x-4 w-fit">
              {array1.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 bg-secondaryDarker border-[1px] border-txWhite cursor-pointer md:hover:px-10 hover:px-8 hover:bg-[#c8cccc] duration-500 transition-all md:px-8 px-4 md:py-6 py-3 rounded-lg"
                >
                  <div>
                    <item.tag className="size-12 px-3 py-1 bg-primaryDark rounded-full" />
                    <p className="font-medium md:text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-3 gap-x-4 w-fit">
              {array2.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-2 bg-secondaryDarker border-[1px] border-txWhite cursor-pointer hover:px-10 hover:bg-[#c8cccc] duration-500 transition-all md:px-8 px-4 md:py-6 py-3 rounded-lg"
                >
                  <div>
                    <item.tag className="size-12 px-3 py-1 bg-primaryDark rounded-full" />
                    <p className="font-medium md:text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-black">
          <h1 className="md:font-semibold font-medium lg:text-4xl text-3xl text-center font-edu">
            Key Features{" "}
          </h1>
          <div className="pt-8 flex flex-col gap-y-4 md:px-36 px-4 m-auto">
            <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-3 gap-x-4 w-full">
              {features1.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-x-2 border-[1px] cursor-pointer rounded-lg"
                >
                  <Image
                    src={item.image}
                    alt="img"
                    className="w-full h-[12rem] hover:object-cover duration-500 transition-all object-fill rounded-t-md"
                  />
                  <div className="py-4 md:px-4 px-2.5">
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-3 gap-x-4 w-full">
              {features2.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-x-2 border-[1px] cursor-pointer rounded-lg"
                >
                  <Image
                    src={item.image}
                    alt="img"
                    className="w-full h-[12rem] hover:object-cover duration-500 transition-all object-fill rounded-t-md"
                  />
                  <div className="py-4 md:px-4 px-2.5">
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-black">
          <h1 className="md:font-semibold font-medium lg:text-4xl text-3xl text-center px-2 font-edu">
            How It Works <br /> (Step-by-Step Guide)
          </h1>
          <div className="pt-8 flex flex-col gap-y-4 md:px-20 px-8">
            <div className="flex gap-x-4 m-auto">
              <Image
                src={bartender}
                alt="img"
                className="md:w-[55rem] w-full md:h-[27rem] h-[14rem] object-cover rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full bg-secondaryDark text-primary py-24 text-center flex flex-col gap-y-3">
            <h1 className="font-medium lg:text-4xl text-2xl font-edu">
              Bring Servlette Into Your Business Today
            </h1>
            <p className="md:text-lg text-base">
              Speak with our enterprise team to see how Servlette fits into your
              tech stack
            </p>
            <div className="m-auto flex flex-col justify-center items-center">
              <Link
                href="#"
                className="w-fit px-4 py-3 text-primaryDark rounded-md bg-primary-orange font-semibold"
              >
                Get in touch
              </Link>
            </div>
          </div>
          <div className="bg-primary py-8 w-full flex md:flex-row flex-col md:px-16 px-8 md:gap-y-0 gap-y-3 justify-between items-center">
            <div className="flex gap-x-3 ">
              <Link href="#" className="underline">
                Terms of Service
              </Link>
              <Link href="#" className="underline">
                Privacy Policy
              </Link>
            </div>

            <div className="flex items-center gap-x-6 ">
              <div className="flex gap-x-4">
                <Link href="#">
                  <Instagram />
                </Link>
                <Link href="#">
                  <Twitter />
                </Link>
                <Link href="#">
                  <Facebook />
                </Link>
              </div>
              <Link
                href="#"
                className="w-fit px-3 py-2 text-primaryDark rounded-md bg-primary-orange font-semibold"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* </GeneralLayout> */}
    </div>
  );
};

export default Start;

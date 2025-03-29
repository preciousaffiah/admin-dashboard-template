import Link from "next/link";
import React, { FC } from "react";
import { Navbar } from "@/components/shared";
import {
  Beer,
  Coffee,
  Facebook,
  Instagram,
  Pizza,
  Twitter,
  UtensilsCrossed,
} from "lucide-react";
import { useAuthToken } from "@/hooks";
import Image from "next/image";
import { SkeletonFour } from "@/components/serviette-ui/globe";
import { SkeletonThree } from "@/components/serviette-ui/yt-widget";


const Start: FC = () => {
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
      title: "Fast Foods and more",
      description: "Handle drink orders, reservations, & staff efficiently.",
      tag: Pizza,
    },
  ];

  const features1 = [
    {
      title: "Real-time Order Management",
      description: "instantly see new customer orders and attend to them.",
      image: "https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272685/servlette/random/orders_cnqmqj.png",
    },

    {
      title: "Menu Customization",
      description: "Update digital menus instantly across locations.",
      image: "https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272687/servlette/random/menu_grj2me.png",
    },
    {
      title: "Sales & Revenue Tracking",
      description:
        "Get detailed reports on orders and payments so you’re always in control.",
      image:
        "https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272690/servlette/random/analytics_tikqhy.png",
    },
  ];

  const features2 = [
    {
      title: "Seamless Payments",
      description:
        "We handle payments from customers and ensure weekly payouts to businesses, automatically deducting a 5% service fee before transferring funds.",
      image: "https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272686/servlette/random/payment_dugp1n.jpg",
    },
    {
      title: "QR Code Generation",
      description:
        "No need for customers to call a waiter; they can scan, order, and even nudge a waiter for assistance when needed.",
      image: "https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272685/servlette/random/qr_udyoqg.png",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center md:gap-y-16 gap-y-10">
        <div className="cover relative flex md:h-[35rem] h-[22rem] w-full items-center justify-center bg-white dark:bg-black">
          {/* <div
            className={cn(
              "absolute inset-0",
              "[background-size:35px_35px]",
              "[background-image:linear-gradient(to_right,#f07a135c_1px,transparent_1px),linear-gradient(to_bottom,#f07a135c_1px,transparent_1px)]",
              "dark:[background-image:linear-gradient(to_right,#f07a13ab_1px,transparent_1px),linear-gradient(to_bottom,#f07a13ab_1px,transparent_1px)]"
            )}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_2%,black)]"></div> */}

          <div className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl  lg:h-[35rem] md:h-[25rem] h-[25rem] w-full px-4">
            <div className="md:text-center text-white m-auto h-full flex flex-col justify-center font-edu capitalize font-medium ">
              <p className="font-semibold lg:text-[7.5rem] md:text-[6.5rem] sm:text-[4.5rem] text-[3rem] uppercase">
                Servlette
              </p>

              <div className="md:w-[64rem] w-full">
                <div className="flex md:flex-row flex-col lg:text-5xl text-3xl md:justify-center md:text-center">
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
        <div className="flex flex-col gap-y-3 lg:w-[75%] md:w-[85%] w-full px-4">
          <div className="flex md:flex-row flex-col justify-center md:gap-y-0 gap-y-3 gap-x-2">
            <div className="image-container md:w-fit w-full">
              <img
                src="https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272696/servlette/random/beer_fc8aox.jpg"
                alt="img"
                className="w-full md:h-[15rem] h-[8rem] object-cover rounded-md"
              />
            </div>
            <div className="image-container w-full">
              <img
                src="https://res.cloudinary.com/dlq0uwrii/image/upload/v1743272699/servlette/random/food_vumibw.jpg"
                alt="img"
                className="w-full md:h-[15rem] h-[8rem] object-cover rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="m-auto flex flex-col justify-center items-center">
          <Link
            href="/business/sign-up"
            className="w-fit px-3 py-2 rounded-md text-white bg-primary-orange font-semibold"
          >
            Start Your Free Trial
          </Link>
        </div>
        <div className="text-primary">
          <h1 className="font-medium lg:text-4xl text-3xl text-center font-edu">
            Who Is Servlette For?
          </h1>
          <div className="pt-8 px-4 flex flex-col gap-y-4 w-full">
            <div className="md:min-w-fit min-w-[80vw] flex md:flex-row flex-col md:gap-y-0 gap-y-3 gap-x-4 w-fit">
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
            <div className="md:min-w-fit min-w-[80vw] flex md:flex-row flex-col md:gap-y-0 gap-y-3 gap-x-4 w-fit">
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

        <div className="text-primary">
          <h1 className="font-medium lg:text-4xl text-3xl text-center font-edu">
            Key Features{" "}
          </h1>
          <div className="pt-8 flex flex-col gap-y-4 lg:px-36 sm:px-10 px-4 m-auto">
            <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-3 gap-x-4 w-full">
              {features1.map((item, index) => (
                <div
                  key={index}
                  className="image-container flex flex-col items-center gap-x-2 border-[1px] cursor-pointer rounded-lg"
                >
                  <img
                    src={`${item.image}`}
                    alt="img"
                    className="w-full h-[12rem] duration-500 transition-all object-cover rounded-t-md"
                  />
                  <div className="py-4 md:px-4 px-2.5">
                    <p className="font-medium text-lg">{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex lg:flex-row flex-col lg:gap-y-0 gap-y-3 gap-x-4 w-full">
              {features2.map((item, index) => (
                <div
                  key={index}
                  className="image-container flex flex-col items-center gap-x-2 border-[1px] cursor-pointer rounded-lg"
                >
                  <img
                    src={`${item.image}`}
                    alt="img"
                    className="w-full h-[12rem] duration-500 transition-all object-cover rounded-t-md"
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
          <h1 className="font-medium lg:text-4xl text-3xl text-center px-2 font-edu">
            How It Works
            <p className="lg:text-3xl text-2xl">(Step-by-Step Guide)</p>
          </h1>
          <div className="pt-8 flex flex-col gap-y-4 md:px-20 px-8">
            <div className="flex gap-x-4 m-auto">
              <SkeletonThree />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full flex lg:flex-row flex-col items-center gap-x-3 md:px-4 pb-0">
            <div className="md:px-0 px-4 w-full">
              <div className="border-[1px] border-txWhite rounded-md w-full bg-secondaryDark text-primary md:py-24 py-16 text-center flex flex-col gap-y-3">
                <h1 className="font-medium lg:text-4xl text-2xl font-edu">
                  Bring Servlette Into Your Business
                </h1>
                <p className="md:text-lg text-base md:px-4">
                  Speak with our enterprise team to see how Servlette fits into
                  your business.
                </p>
                <div className="flex flex-col justify-center items-center">
                  <Link
                    href="/business/sign-up"
                    className="w-fit px-4 py-3 text-white rounded-md bg-primary-orange font-semibold"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
            </div>
            <div className=" w-full lg:px-8 text-primary pb-0 lg:pb-24 pt-24 text-center flex flex-col gap-y-3">
              <div className="px-4">
                <h1 className="font-medium md:text-4xl text-3xl font-edu">
                  Join millions of businesses Today
                </h1>
                <p className="md:text-lg text-base">
                  Don't be left out, join the cool team.
                </p>
              </div>
              <div className=" relative overflow-hidden">
                <SkeletonFour />
              </div>
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
                href="/business/sign-up"
                className="w-fit px-3 py-2 text-white rounded-md bg-primary-orange font-semibold"
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

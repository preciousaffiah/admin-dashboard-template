import Image from "next/image";
import Link from "next/link";
import logo from "public/Logo.png";
import { Play, SquareMenu } from "lucide-react";
import React, { FC } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthToken } from "@/hooks";

const Navbar: FC = () => {
  const navItems = [
    {
      title: "Home",
      link: "#",
    },
    {
      title: "About",
      link: "#",
    },
    {
      title: "Partners",
      link: "#",
    },
    {
      title: "Documentation",
      link: "#",
    },
  ];
  const path = usePathname();
  const { token } = useAuthToken();

  return (
    <div>
      <div className="md:flex hidden w-full bg-black py-3 text-[#FEFEFE] items-center px-4">
        <div className="w-[20%]">
          <Image alt="logo" src={logo} className="w-32 h-8" />
        </div>

        <div className="w-[55%] flex pl-5">
          {navItems.map((item, index) => (
            <li key={index} className="list-none px-4 text-[0.98rem]">
              <Link
                href={item.link}
                className={`${item.link === path ? "font-bold" : ""} text-base`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </div>
        <div className="flex justify-end w-[25%] gap-x-1">
          {!token && (
            <Link href="/auth/sign-in">
              <p className="text-white px-3 py-1 bg-primary-orange rounded-md ">
                SignIn
              </p>
            </Link>
          )}
          {path !== "/restaurant/sign-up" && token && (
            <Link href="/restaurant/sign-up">
              <p className="text-white px-3 py-1 bg-primary-orange rounded-md ">
                Register business
              </p>
            </Link>
          )}

          <div className=" bg-primary-orange flex justify-center py-1 rounded-md px-1">
            <Play fill="white" className="pr-2" />

            <p className="md:text-base text-sm">Watch Video</p>
          </div>
        </div>
      </div>
      <div className="md:hidden justify-between flex pt-4 px-4 text-white">
        <div className="flex gap-x-3 items-center">
          {!token && (
            <Link href="/auth/sign-in">
              <p className="text-white p-2 bg-primary-orange rounded-md ">
                SignIn
              </p>
            </Link>
          )}
          {path !== "/restaurant/sign-up" && token && (
            <Link href="/restaurant/sign-up">
              <p className="text-white p-2 bg-primary-orange rounded-md ">
                Register business
              </p>
            </Link>
          )}

          <div className=" bg-primary-orange flex justify-center p-2 rounded-md">
            <Play fill="white" className="pr-2" />

            <p className="md:text-base text-sm">Watch Video</p>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-0 hover:bg-none hover:text-none"
            >
              <SquareMenu color="#A5A5A5" className="w-12 h-12" />
            </Button>
          </SheetTrigger>
          <SheetContent className="px-0 border-none">
            <div className="text-secondary-border py-8 text-end font-medium">
              {navItems.map((item, index) => (
                <li key={index} className="list-none px-4 text-xl">
                  <Link
                    href={item.link}
                    className={`${
                      item.link === path ? "text-yellow-400 font-bold" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;

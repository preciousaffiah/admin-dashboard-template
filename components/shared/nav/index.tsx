import Image from "next/image";
import Link from "next/link";
import logo from "public/Logo.png";
import {
  AlignRight,
  BadgeInfo,
  BookText,
  Handshake,
  Home,
  LogOut,
  Play,
  SquareMenu,
} from "lucide-react";
import React, { FC } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthToken } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import orderImg from "public/orderimg.png";

const Navbar: FC = () => {
  const navItems = [
    {
      title: "Home",
      link: "#",
      tag: Home,
    },
    {
      title: "About",
      link: "#",
      tag: BadgeInfo,
    },
    {
      title: "Partners",
      link: "#",
      tag: Handshake,
    },
    {
      title: "Documentation",
      link: "#",
      tag: BookText,
    },
  ];
  const path = usePathname();
  const { token, userData, logout } = useAuthToken();

  return (
    <div className="bg-background">
      <div className="md:flex hidden w-full py-4 text-txWhite items-center px-4">
        <div className="w-[20%]">
          <Image alt="logo" src={logo} className="w-32 h-8" />
        </div>

        <div className="w-[50%] flex pl-5">
          {navItems.map((item, index) => (
            <li key={index} className="list-none px-4 text-[0.98rem]">
              <Link
                href={item.link}
                className={`${
                  item.link === path ? "font-bold" : ""
                } text-base auth-subheader`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </div>
        <div className="flex justify-end w-[30%] gap-x-1 text-white">
          {!token && (
            <Link href="/auth/sign-in">
              <p className="px-3 py-1 bg-primary-orange rounded-md ">SignIn</p>
            </Link>
          )}
          {path !== "/restaurant/sign-up" && (
            <Link href="/restaurant/sign-up">
              <p className="px-3 py-1 bg-primary-orange rounded-md ">
                Register business
              </p>
            </Link>
          )}

          <div className="bg-primary-orange flex justify-center py-1 rounded-md px-1">
            <Play fill="white" className="pr-2" />

            <p className="md:text-base text-sm">Watch Video</p>
          </div>
        </div>
        {token && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="items-center text-xs leading-4 h-fit w-fit flex bg-foreground px-1 py-1 rounded-full gap-x-1">
                  <div>
                    <Image
                      alt="img"
                      src={orderImg}
                      className="rounded-full w-10"
                    />
                  </div>

                  <span className="max-w-32 break-words">
                    {userData?.fullname}
                  </span>
                  <LogOut
                    onClick={logout}
                    color="#c01c28"
                    className="size-6 m-auto text-secondaryBorder"
                  />
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="md:hidden justify-between flex py-4 px-4 text-white">
        <div className="flex gap-x-3 items-center">
          {!token && (
            <Link href="/auth/sign-in">
              <p className="p-2 bg-primary-orange rounded-md ">SignIn</p>
            </Link>
          )}
          {path !== "/restaurant/sign-up" && (
            <Link href="/restaurant/sign-up">
              <p className="p-2 bg-primary-orange rounded-md ">
                Register business
              </p>
            </Link>
          )}

          <div className=" bg-primary-orange flex justify-center items-center p-2 rounded-md">
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
              <AlignRight color="#A5A5A5" className="w-12 h-12" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="px-0 border-none flex justify-start"
          >
            <div className="text-secondaryBorder py-8 font-medium px-3 mt-7">
              {navItems.map((item: any, index) => (
                <li key={index} className="flex py-2.5 items-center list-none">
                  <item.tag className="size-7" />

                  <Link
                    href={item.link}
                    className={`${
                      item.link === path ? "text-yellow-400 font-bold" : ""
                    } px-4`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {token && (
                <div className="flex items-center pt-2.5">
                  <LogOut className="size-7" />
                  <p className=" px-4 ">Logout</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;

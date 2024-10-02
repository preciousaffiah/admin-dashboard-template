import Image from "next/image";
import Link from "next/link";
import logo from "public/Logo.png";
import { Play } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { FC } from "react";
import { usePathname } from "next/navigation";


const Navbar: FC = () => {

  const navItems = [
    {
      title: "Home",
      link: "/auth/sign-up"
    },
    {
      title: "About",
      link: "/auth/sign-in"
    },
    {
      title: "Partners",
      link: "/"
    },
    {
      title: "Documentation",
      link: "/"
    }
  ]
    const path = usePathname()

  return (
      <div className="md:flex hidden w-full bg-black py-3 text-[#FEFEFE] items-center px-4">
        <div className="w-[20%]">
          <Image alt="logo" src={logo} className="w-32 h-8" />
        </div>

        <div className="w-[69%] flex pl-5">
          {
            navItems.map((item, index) => (
              <li key={index} className="list-none px-4 text-[0.98rem]">
                <Link href={item.link} className={`${item.link === path ? "text-yellow-400 font-bold" : ""} text-base`}>{item.title}</Link>
              </li>
            ))
          }
        </div>
        <div className="w-[11%] bg-primary-orange flex justify-center py-1 rounded-md px-1">
          <Play fill="white" className="pr-2" />

          <p>Watch Video</p>

        </div>
      </div>
  );
}

export default Navbar;

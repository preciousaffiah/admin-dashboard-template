import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import bartender from "public/bartender.jpg";

export const SkeletonThree = () => {
  return (
    <Link
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="__blank"
      className="relative w-full flex gap-10  h-full group/image"
    >
      <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 lg:w-[55rem] md:w-[45rem] sm:w-[31rem] w-[21rem] md:h-[27rem] h-[14rem] object-cover  flex-col space-y-2  relative">
          {/* TODO */}
          <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
          <Image
            src={bartender}
            alt="header"
            //   width={100}
            //   height={100}
            fill
            className="aspect-square rounded-md object-cover object-center"
          />
        </div>
      </div>
    </Link>
  );
};

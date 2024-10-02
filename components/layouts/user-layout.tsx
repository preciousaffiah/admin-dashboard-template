import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { useAuthToken } from "@hooks";
import { MainWrapper, SideNav } from "@/components/serviette-ui";

interface ILayout {
  children: JSX.Element | React.ReactNode;
  title: string; 
  description?: string;
}

export default function UserLayout({
  children,
  title, 
  description,
}: ILayout) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { token, isLoading } = useAuthToken();
  title = title || "Page Title";
  description = description || "Page description";

  useEffect(() => {
    // if (isLoading) return;
    // if (!token) router.push("/auth/sign-in");
  }, [isLoading, router, token]);

  return (
    <Fragment>
      <Head>
        <title>{`Blnk | ${title}`}</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="author" content="Blnk" />
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <meta name="description" content={description} />
        <meta name="title" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Blnk" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:url" content="http://https://www.blnkfinance.com/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="http://https://www.blnkfinance.com/images/logo-preview.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="http://https://www.blnkfinance.com/"
        />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta
          property="twitter:image"
          content="http://https://www.blnkfinance.com/images/logo-preview.png"
        />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen">
        <SideNav isSidebarOpen={isSidebarOpen} />

        <MainWrapper
          content={children}
          title={title}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </Fragment>
  );
}

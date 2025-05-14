import { Fragment, useEffect } from "react";
import Head from "next/head";
import WaiterSidebar from "../shared/nav/sidebar/waiter";
import { PageAnimation } from "../flenjo-ui";
import { useAuthToken, useSocket } from "@/hooks";
import { useRouter } from "next/router";
import { MainNavbar } from "../shared";

interface ILayout {
  children: JSX.Element | React.ReactNode;
  title: string;
  subtitle?: string;
  heading?: string;
  description?: string;
}

export default function StaffLayout({
  children,
  title,
  subtitle,
  heading,
  description,
}: ILayout) {
  title = title || "Page Title";
  subtitle = subtitle || "";
  description =
    description ||
    "Flenjo- A Global Saas all in one management for your businesses";
  heading = heading || title;

  const router = useRouter();
  const { token, userData, isLoading } = useAuthToken();
  console.log(userData);
  
  useSocket()

  useEffect(() => {
    if (isLoading) return;
    if (!token || !userData?.businessId) router.push("/");
  }, [isLoading, router, token]);

  return (
    <Fragment>
      <Head>
       <title>{`Flenjo | ${title}`}</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="author" content="Flenjo" />
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <meta name="description" content={description} />
        <meta name="title" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Flenjo" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:url" content="https://tryflenjo.com/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
                    content="https://storage.googleapis.com/flenjo-456113.appspot.com/random/circledFlenjo.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://tryflenjo.com/"
        />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta
          property="twitter:image"
                    content="https://storage.googleapis.com/flenjo-456113.appspot.com/random/circledFlenjo.png"
        />
       <link rel="icon" type="image/x-icon" href="https://storage.googleapis.com/flenjo-456113.appspot.com/random/circledFlenjoIcon.png" />      </Head>

      </Head>

      <div className="flex flex-col h-screen min-h-screen">
        <WaiterSidebar />

        <MainNavbar title={title} subtitle={subtitle} />

        <PageAnimation>
          {/* nav */}

          {/* form */}
          {children}
        </PageAnimation>
      </div>
    </Fragment>
  );
}

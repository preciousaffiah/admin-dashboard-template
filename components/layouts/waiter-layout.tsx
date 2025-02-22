import { Fragment, useEffect } from "react";
import Head from "next/head";
import WaiterSidebar from "../shared/nav/sidebar/waiter";
import { PageAnimation } from "../serviette-ui";
import { useAuthToken } from "@/hooks";
import { useRouter } from "next/router";
import { MainNavbar } from "../shared";

interface ILayout {
  children: JSX.Element | React.ReactNode;
  title: string;
  subtitle?: string;
  heading?: string;
  description?: string;
}

export default function WaiterLayout({
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
    "A Global restaurant known for serving the best meals to customers";
  heading = heading || title;

  const router = useRouter();

  const { token, userData, isLoading } = useAuthToken();

  useEffect(() => {
    if (isLoading) return;
    if (!token || !userData?.businessId) console.log(token, userData);

    router.push("/");
  }, [isLoading, router, token]);

  return (
    <Fragment>
      <Head>
        <title>{`Serviette | ${title}`}</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="author" content="Serviette" />
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
        <meta name="description" content={description} />
        <meta name="title" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Serviette" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:url" content="https://my-serviette.vercel.app/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlq0uwrii/image/upload/v1728843002/Logo_qcsyol.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://my-serviette.vercel.app/"
        />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dlq0uwrii/image/upload/v1728843002/Logo_qcsyol.png"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://res.cloudinary.com/dlq0uwrii/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1728843002/Logo_qcsyol.png"
        />
      </Head>

      <div className="flex flex-col h-screen min-h-screen">
        <WaiterSidebar />

        <MainNavbar title={title} />

        <PageAnimation>
          {/* nav */}

          {/* form */}
          {children}
        </PageAnimation>
      </div>
    </Fragment>
  );
}

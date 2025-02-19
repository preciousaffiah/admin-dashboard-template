import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Edu_NSW_ACT_Foundation } from "next/font/google";

const queryClient = new QueryClient();

// Load fonts
const eduNSW = Edu_NSW_ACT_Foundation({
  subsets: ["latin"],
  variable: "--font-edu",
  weight: ["600"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${eduNSW.variable} font-edu`}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
}

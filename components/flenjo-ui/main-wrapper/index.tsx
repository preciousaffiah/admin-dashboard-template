import { PageAnimation } from "@/components/flenjo-ui";
import HeaderBreadcrumb from "./header-breadcrumb";

export default function MainWrapper({
  content,
  title,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  content: JSX.Element | React.ReactNode;
  title?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}) {
  return (
    <main className="flex-1 bg-black-primary">
      <header className="flex justify-between items-center p-4 border-b-[0.5px] border-gray-800">
        <HeaderBreadcrumb />
        <button
          className="md:hidden bg-gray-800 text-txWhite p-2 rounded"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>
      </header>
      <section className=" bg-black-container text-txWhite p-4">
        <PageAnimation>{content}</PageAnimation>
      </section>
    </main>
  );
}

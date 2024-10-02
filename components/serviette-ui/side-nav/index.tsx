import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import UserDropdown from "./user-dropdown";
import UserPrompt from "./user-prompt";
import { linkList } from "@utils/links";

export default function SideNav({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const router = useRouter();
  const pathname = router.pathname;
  const [hasMounted, setHasMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <aside
      className={`w-72 bg-black-primary text-white ${
        isSidebarOpen ? "block" : "hidden"
      } md:block border-r-[0.5px] border-gray-800`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <UserDropdown />

          {hasMounted && (
            <div className="p-4">
              {linkList.map((category, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-md mb-4 text-black-secondary">
                    {category.title}
                  </h2>
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => {
                      const isActive = link.activePaths.includes(pathname);
                      const hasChildren = link.children;
                      return (
                        <li key={linkIndex}>
                          <div>
                            <Link
                              href={hasChildren ? "#" : link.path}
                              className={`flex justify-between items-center p-2 px-4 hover:bg-item-active rounded-lg ${
                                isActive ? "bg-item-active" : "bg-black-primary"
                              }`}
                              onClick={() =>
                                hasChildren && toggleSection(index)
                              }
                            >
                              <div className="flex">
                                <span className="mr-3">
                                  {link.icon && (
                                    <link.icon
                                      className={`$isActive
                                      ? "text-white"
                                      : "text-black-secondary"`}
                                    />
                                  )}
                                </span>
                                {link.title}
                              </div>

                              {hasChildren && (
                                <ChevronDown
                                  className={`text-black-secondary transition-transform duration-200 ${
                                    expandedSections[index]
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              )}
                            </Link>
                            {link.children && (
                              <AnimatePresence>
                                {expandedSections[index] && (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pl-8 space-y-2 mt-2"
                                  >
                                    {link.children.map((child, childIndex) => (
                                      <li key={childIndex}>
                                        <Link
                                          href={child.path}
                                          className={`block p-2 px-4 hover:bg-item-active rounded-lg ${
                                            child.activePaths.includes(pathname)
                                              ? "bg-item-active"
                                              : "bg-black-primary"
                                          }`}
                                        >
                                          {child.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <UserPrompt />
      </div>
    </aside>
  );
}

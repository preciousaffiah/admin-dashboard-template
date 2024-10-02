import { linkList } from "./links";

interface BreadcrumbItem {
  icon: any;
  title: string;
  path: string;
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      title: "Home",
      path: "/",
      icon: undefined,
    },
  ];

  function traverse(links: any[], parentPath: string = ""): boolean {
    for (const link of links) {
      const fullPath = parentPath + link.path;
      if (link.activePaths.includes(pathname)) {
        items.push({
          title: link.title,
          path: fullPath,
          icon: undefined,
        });
        return true;
      }
      if (link.children) {
        const found = traverse(link.children, fullPath);
        if (found) {
          items.push({
            title: link.title,
            path: fullPath,
            icon: undefined,
          });
          return true;
        }
      }
    }
    return false;
  }

  for (const category of linkList) {
    if (traverse(category.links)) break;
  }

  return items;
}

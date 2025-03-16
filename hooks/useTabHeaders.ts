import { useBusinessDetailsWithoutAuth } from ".";

const staticTabHeaders = {
  all: "all",
};

const useTabHeaders = (query: {}) => {
  const { data } = useBusinessDetailsWithoutAuth(query);

  const categoryTabs =
    data?.menuCategories?.reduce((acc: any, category: any) => {
      acc[category] = category;
      return acc;
    }, {} as Record<string, string>) || {};

  const tabHeaders = { ...staticTabHeaders, ...categoryTabs };

  return tabHeaders;
};

export default useTabHeaders;

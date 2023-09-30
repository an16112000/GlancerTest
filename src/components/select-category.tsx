import { Select, type SelectProps } from "@mantine/core";
import React from "react";
import { useMemo } from "react";

import { api } from "../utils/api";

type Props = Omit<SelectProps, "data">;

export const SelectCategory: React.FC<Props> = ({ ...props }) => {
  const { data: categories } = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const categoryList = useMemo(() => {
    if (!categories) return [];

    return categories.map((item) => ({ label: item.name, value: item.id }));
  }, [categories]);

  return (
    <Select label="Lĩnh vực" searchable clearable nothingFound="Không có kết quả" data={categoryList} {...props} />
  );
};

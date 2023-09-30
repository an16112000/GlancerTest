import { Select, type SelectProps } from "@mantine/core";
import React from "react";
import { useMemo } from "react";

import { api } from "../utils/api";

type Props = Omit<SelectProps, "data">;

export const SelectDegree: React.FC<Props> = ({ ...props }) => {
  const { data: degrees } = api.degree.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const degreeList = useMemo(() => {
    if (!degrees) return [];

    return degrees.map((item) => ({ label: item.name, value: item.id }));
  }, [degrees]);

  return <Select label="Bẳng cấp" searchable clearable nothingFound="Không có kết quả" data={degreeList} {...props} />;
};

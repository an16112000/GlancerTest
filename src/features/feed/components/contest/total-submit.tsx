import { Text } from "@mantine/core";
import React from "react";
import { useMemo } from "react";

import { api } from "../../../../utils/api";

type Props = {
  contestId: string;
};

export const TotalSubmit: React.FC<Props> = ({ contestId }) => {
  const { data: productList } = api.productContest.getProductListByContest.useQuery(
    { contestId },
    { refetchOnWindowFocus: false },
  );

  const total = useMemo(() => productList?.length || 0, [productList?.length]);

  return <Text size="sm">{total} sản phẩm đã nộp</Text>;
};

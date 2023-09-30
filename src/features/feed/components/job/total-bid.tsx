import { Text } from "@mantine/core";
import React from "react";
import { useMemo } from "react";

import { api } from "../../../../utils/api";

type Props = {
  jobId: string;
};

export const TotalBid: React.FC<Props> = ({ jobId }) => {
  const { data: bidList } = api.bidJob.getBidListByJob.useQuery({ jobId }, { refetchOnWindowFocus: false });

  const total = useMemo(() => bidList?.length || 0, [bidList?.length]);

  return <Text size="sm">{total} báo giá</Text>;
};

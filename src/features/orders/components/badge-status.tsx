import { Badge } from "@mantine/core";
import { OrderStatus } from "@prisma/client";
import React from "react";
import { useMemo } from "react";

export const BadgeStatus = ({ status }: { status: OrderStatus }) => {
  const colorStatus = useMemo(
    () =>
      status === OrderStatus.REJECTED
        ? "dark"
        : status === OrderStatus.DOING
        ? "orange"
        : status === OrderStatus.COMPLETED
        ? "green"
        : status === OrderStatus.CANCELED
        ? "red"
        : "blue",
    [status],
  );

  const textStatus = useMemo(
    () =>
      status === OrderStatus.REJECTED
        ? "TỪ CHỐI"
        : status === OrderStatus.DOING
        ? "ĐANG LÀM"
        : status === OrderStatus.COMPLETED
        ? "HOÀN THÀNH"
        : status === OrderStatus.CANCELED
        ? "HỦY BỎ"
        : "CHỜ DUYỆT",
    [status],
  );

  return <Badge color={colorStatus}>{textStatus}</Badge>;
};

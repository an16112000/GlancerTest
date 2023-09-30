import { Divider, Group, Text } from "@mantine/core";
import {
  type OrderService,
  OrderStatus,
  type ReviewService,
  type ReviewUser,
  type Service,
  type User,
} from "@prisma/client";
import React, { useMemo } from "react";

import { OwnerSummarize, ServiceRating } from "./components";

type Props = {
  service?:
    | (Service & {
        reviews?: ReviewService[];
        owner?: User & {
          listBeReviewed?: ReviewUser[];
        };
        orders?: OrderService[];
      })
    | null;
};

export const TopbarSection: React.FC<Props> = ({ service }) => {
  const pendingOrdersCount = useMemo(
    () => service?.orders?.filter((item) => item.status === OrderStatus.PENDING).length || 0,
    [service?.orders],
  );

  return (
    <Group>
      <OwnerSummarize owner={service?.owner} />

      <Divider orientation="vertical" />

      <ServiceRating service={service} />

      <Divider orientation="vertical" />

      <Text c="dimmed">{pendingOrdersCount} yêu cầu đang đặt</Text>
    </Group>
  );
};

import { Group, Rating, Text } from "@mantine/core";
import type { ReviewService, Service } from "@prisma/client";
import React, { useMemo } from "react";

type Props = {
  service?:
    | (Service & {
        reviews?: ReviewService[];
      })
    | null;
};

export const ServiceRating: React.FC<Props> = ({ service }) => {
  const ratingValue = useMemo(() => {
    if (!service?.reviews?.length) return 0;

    const avg = service?.reviews.reduce((sum, prev) => (sum += prev.rating), 0) / service?.reviews.length;

    return parseFloat(avg.toFixed(2));
  }, [service?.reviews]);

  return (
    <Group spacing="xs">
      <Rating value={ratingValue} fractions={2} readOnly />

      <Text>({service?.reviews?.length || 0})</Text>
    </Group>
  );
};

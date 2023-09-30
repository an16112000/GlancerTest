import { Group, Rating, Text } from "@mantine/core";
import type { ReviewUser, User } from "@prisma/client";
import React from "react";

type Props = {
  owner?: User & {
    listBeReviewed?: ReviewUser[];
  };
};

export const OwnerRating: React.FC<Props> = ({ owner }) => {
  const totalReviews = React.useMemo(() => {
    return owner?.listBeReviewed?.length || 0;
  }, [owner?.listBeReviewed]);

  const ratingValue = React.useMemo(() => {
    if (!totalReviews) return 0;

    const avg = owner?.listBeReviewed?.reduce((sum, review) => (sum += review.rating), 0) || 0 / totalReviews;

    return parseFloat(avg.toFixed(2));
  }, [owner?.listBeReviewed, totalReviews]);

  return (
    <Group spacing="xs">
      <Rating value={ratingValue} fractions={2} readOnly />

      <Text>({totalReviews})</Text>
    </Group>
  );
};

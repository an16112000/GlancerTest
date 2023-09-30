import { Box, Group, Rating, Text, Title } from "@mantine/core";
import type { ReviewService, User } from "@prisma/client";
import { nanoid } from "nanoid";
import { useMemo } from "react";

import { ReviewCard } from "./components";

type Props = {
  reviews?: Array<
    ReviewService & {
      reviewer?: User;
    }
  >;
};

export const ReviewSection: React.FC<Props> = ({ reviews = [] }) => {
  const ratingValue = useMemo(() => {
    if (!reviews.length) return 0;

    const avg = reviews.reduce((sum, prev) => (sum += prev.rating), 0) / reviews.length;

    return parseFloat(avg.toFixed(2));
  }, [reviews]);

  return (
    <>
      <Group>
        <Title order={3}>Đánh giá</Title>

        <Group spacing="xs">
          <Rating value={ratingValue} fractions={2} readOnly />

          <Text>({reviews.length})</Text>
        </Group>
      </Group>

      {!reviews.length ? (
        <Text pt="xl">(Chưa có đánh giá)</Text>
      ) : (
        reviews.map((review) => (
          <Box pt="xl" key={nanoid()}>
            <ReviewCard review={review} />
          </Box>
        ))
      )}
    </>
  );
};

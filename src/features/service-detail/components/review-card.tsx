import { Avatar, Box, Group, Rating, Text } from "@mantine/core";
import type { ReviewService, User } from "@prisma/client";
import React from "react";

import { formatName } from "../../../utils/formatter";

type Props = {
  review?: ReviewService & {
    reviewer?: User;
  };
};

export const ReviewCard: React.FC<Props> = ({ review }) => {
  return (
    <>
      <Group>
        <Avatar src={review?.reviewer?.image} size="md" sx={{ borderRadius: "100%" }}>
          {formatName(review?.reviewer?.name)}
        </Avatar>

        <Box>
          <Text>{review?.reviewer?.name}</Text>

          <Rating value={review?.rating} fractions={2} readOnly py="xs" />
        </Box>
      </Group>

      <Text>{review?.comment}</Text>
    </>
  );
};

import { Avatar, Box, type BoxProps, Divider, Group, Rating, Text, Title } from "@mantine/core";
import type { ReviewUser, User } from "@prisma/client";
import { nanoid } from "nanoid";
import React from "react";

import { formatName } from "../../utils/formatter";
import { OwnerRating } from "../service-detail/components";

type Props = BoxProps & {
  user: User & {
    listBeReviewed: (ReviewUser & {
      userDoReview: User;
    })[];
  };
};

export const UserReviewSection: React.FC<Props> = ({ user, ...props }) => {
  return (
    <Box {...props}>
      <Group mb="md">
        <Title order={4}>Đánh giá</Title>

        <OwnerRating owner={user} />
      </Group>

      {user.listBeReviewed.map(({ userDoReview, rating, comment }, index) => (
        <Box key={nanoid()} mt="sm">
          <Group align="start" spacing="xs">
            <Avatar src={userDoReview.image} radius="xl" mt="xs">
              {formatName(userDoReview.name)}
            </Avatar>

            <Box>
              <Title order={5}>{userDoReview.name}</Title>

              <Rating readOnly value={rating} my={5} />

              <Text>{comment}</Text>
            </Box>
          </Group>

          {index !== user.listBeReviewed.length - 1 && <Divider mt="sm" />}
        </Box>
      ))}
    </Box>
  );
};

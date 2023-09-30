import { Avatar, Box, type BoxProps, Group, Text, Title } from "@mantine/core";
import type { ReviewUser, User } from "@prisma/client";
import { IconAt, IconMapPin, IconPhone } from "@tabler/icons";
import React from "react";

import { formatName } from "../../utils/formatter";

type Props = BoxProps & {
  user: User & {
    listBeReviewed: (ReviewUser & {
      userDoReview: User;
    })[];
  };
};

export const UserInfoSection: React.FC<Props> = ({ user, ...props }) => {
  return (
    <Box {...props}>
      <Group spacing="xl" mb="xl">
        <Avatar size="xl" sx={{ borderRadius: "100%" }} src={user.image}>
          {formatName(user.name)}
        </Avatar>

        <Box>
          <Title order={3}>{user.name}</Title>

          <Box mt={5}>
            <Group spacing={5}>
              <IconMapPin size="0.9rem" />

              <Text>{user.address}</Text>
            </Group>

            <Group>
              <Group spacing={5}>
                <IconAt size="0.9rem" />

                <Text>{user.email}</Text>
              </Group>

              <Group spacing={5}>
                <IconPhone size="0.9rem" />

                <Text>{user.phone}</Text>
              </Group>
            </Group>
          </Box>
        </Box>
      </Group>
    </Box>
  );
};

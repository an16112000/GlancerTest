import { Avatar, Badge, Card, Group, Image, Text } from "@mantine/core";
import type { Category, ReviewService, Service, User } from "@prisma/client";
import { IconStar } from "@tabler/icons";
import Link from "next/link";
import React from "react";

import { formatPrice } from "../utils/formatter";

type Props = Service & {
  owner: User;
  category: Category;
  reviews: ReviewService[];
};

export const ServiceCard: React.FC<Props> = ({ id, banner, name, price, owner, category, reviews }) => {
  return (
    <Link href={`/services/${id}`}>
      <Card shadow="sm" p="md" radius="md" sx={{ cursor: "pointer" }} pos="relative" h="100%">
        <Card.Section>
          <Image src={banner} height={200} alt="Norway" />
        </Card.Section>

        <Badge variant="filled" pos="absolute" top={10} left={10}>
          {category.name}
        </Badge>

        <Group spacing="xs" mt="md">
          <Avatar size="sm" src={owner.image} alt="" radius="xl" />

          <Text fz="sm" lineClamp={1}>
            {owner.name}
          </Text>
        </Group>

        <Text weight={500} mt="md" mb="xs" lineClamp={1}>
          {name}
        </Text>

        <Group position="apart" mt="md">
          <Group spacing="xs">
            <IconStar fill="orange" color="orange" size="1rem" />

            <Text>{reviews.reduce((sum, review) => (sum += review.rating), 0)}</Text>

            <Text c="dimmed">({reviews.length})</Text>
          </Group>

          <Text weight="bold" ta="end">
            {formatPrice(price)} VND
          </Text>
        </Group>
      </Card>
    </Link>
  );
};

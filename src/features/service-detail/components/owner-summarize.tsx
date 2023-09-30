import { Avatar, Group, Text } from "@mantine/core";
import type { ReviewUser, User } from "@prisma/client";
import Link from "next/link";
import React from "react";

import { formatName } from "../../../utils/formatter";

type Props = {
  owner?: User & {
    listBeReviewed?: ReviewUser[];
  };
};

export const OwnerSummarize: React.FC<Props> = ({ owner }) => {
  return (
    <Link href={`/profile/freelancer/${owner?.id || ""}`} target="_blank" rel="noopener noreferrer">
      <Group spacing="xs">
        <Avatar src={owner?.image} radius="xl">
          {formatName(owner?.name)}
        </Avatar>

        <Text>{owner?.name}</Text>
      </Group>
    </Link>
  );
};

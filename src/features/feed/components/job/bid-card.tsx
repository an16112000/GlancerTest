import { ActionIcon, Avatar, Group, Text } from "@mantine/core";
import type { User } from "@prisma/client";
import { IconTrash } from "@tabler/icons";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { api } from "../../../../utils/api";
import { formatName, formatPrice } from "../../../../utils/formatter";
import { notiDelete } from "../../../../utils/notificator";

type Props = {
  freelancer: User;
  price: number;
  createdAt: Date;
  jobId: string;
  onSuccess: () => Promise<void>;
};

const _BidCard: React.FC<Props> = ({ freelancer, price, createdAt, jobId, onSuccess }) => {
  const { data: session } = useSession();
  const { mutateAsync: deleteBid } = api.bidJob.delete.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteBid({ jobId, freelancerId: freelancer.id });

      await onSuccess();

      notiDelete({ subject: "báo giá" });
    } catch (error) {
      console.log(error);

      notiDelete({ isFailed: true, subject: "báo giá" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Group position="apart" mt="xs">
      <Group spacing="xs">
        <Avatar size="sm" radius="xl" src={freelancer.image}>
          {formatName(freelancer.name)}
        </Avatar>

        <Text>{formatPrice(price)}</Text>
      </Group>

      <Group>
        <Text fz="xs">{moment(createdAt).format("DD/MM/YYYY HH:mm")}</Text>

        {session?.user?.id === freelancer.id && (
          <ActionIcon variant="light" color="red" loading={isDeleting} onClick={() => void handleDelete()}>
            <IconTrash size="1rem" />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
};

export const BidCard = React.memo(_BidCard);

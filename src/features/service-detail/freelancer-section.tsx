import { Avatar, Box, Button, Divider, Grid, Group, Paper, Text, Title } from "@mantine/core";
import type { ReviewUser, User } from "@prisma/client";
import moment, { type MomentInput } from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo } from "react";

import { api } from "../../utils/api";
import { formatName } from "../../utils/formatter";
import { OwnerRating } from "./components";

type Props = {
  owner?: User & {
    listBeReviewed?: ReviewUser[];
  };
  isOwned: boolean;
};

export const FreelancerSection: React.FC<Props> = ({ owner, isOwned }) => {
  const { status } = useSession();
  const { data } = api.transaction.getTotalReceived.useQuery(
    { userId: owner?.id || "" },
    { enabled: !!owner && !!owner.id },
  );

  const doneProjects = useMemo(() => data?.length || 0, [data?.length]);

  return (
    <>
      <Title order={3} mb="md">
        Về freelancer
      </Title>

      <Group position="apart">
        <Group>
          <Avatar src={owner?.image} size="xl" sx={{ borderRadius: "100%" }}>
            {formatName(owner?.name)}
          </Avatar>

          <Box>
            <Link href={`/profile/freelancer/${owner?.id || ""}`} target="_blank" rel="noopener noreferrer">
              <Text>{owner?.name}</Text>
            </Link>

            <Box my="xs">
              <OwnerRating owner={owner} />
            </Box>
          </Box>
        </Group>

        <Button variant="outline" disabled={isOwned || status !== "authenticated"}>
          Liên hệ
        </Button>
      </Group>

      <Paper withBorder mt="xl" p="xl">
        <Grid>
          <Grid.Col span={6}>
            <Text>Ngày tham gia</Text>
            <Text fw="bold">{moment(owner?.createdAt as MomentInput).format("DD/MM/YYYY")}</Text>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text>Dự án đã hoàn thành</Text>
            <Text fw="bold">{doneProjects}</Text>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Text>{owner?.description || `(Chưa có mô tả)`}</Text>
      </Paper>
    </>
  );
};

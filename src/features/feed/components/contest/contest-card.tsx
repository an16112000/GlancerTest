import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  type PaperProps,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import type { Category, Contest, ProductContest, User } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo } from "react";

import { useRefPortal } from "../../../../hooks";
import { formatName, formatPrice } from "../../../../utils/formatter";
import { ContestDetail } from "./contest-detail";
import { TopSection } from "./top-section";
import { TotalSubmit } from "./total-submit";

type Props = PaperProps & {
  contest: Contest & {
    category: Category;
    owner: User;
    products: (ProductContest & {
      freelancer: User;
    })[];
  };
};

export const ContestCard: React.FC<Props> = ({ contest, ...props }) => {
  const ref = useRefPortal<typeof ContestDetail>();
  const { data: session } = useSession();

  const isOwned = useMemo(() => contest?.ownerId === session?.user?.id, [contest?.ownerId, session?.user?.id]);

  const handleClickSubmit = () => {
    ref.current?.openModal(contest);
  };

  return (
    <Paper withBorder sx={{ overflow: "hidden" }} {...props}>
      <Box px="xl" pt="lg">
        <TopSection categoryName={contest.category.name} contestId={contest.id} ownerId={contest.ownerId} />

        <Title order={3}>{contest.name}</Title>

        <Group position="apart">
          <Link href={`/profile/client/${contest.owner.id}`} target="_blank" rel="noopener noreferrer">
            <Group spacing="xs" my="md">
              <Avatar size="md" radius="xl" src={contest.owner.image}>
                {formatName(contest.owner.name)}
              </Avatar>

              <Box>
                <Text size="sm" fw={600}>
                  {contest.owner.name}
                </Text>

                <Text size="xs">{moment(contest.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
              </Box>
            </Group>
          </Link>

          <Text fw="bold">{formatPrice(contest.budget)}</Text>
        </Group>

        <TypographyStylesProvider fz="sm">
          <div dangerouslySetInnerHTML={{ __html: contest.info }} />
        </TypographyStylesProvider>
      </Box>

      <Divider />

      <Group position="apart" px="xl" py="sm">
        <TotalSubmit contestId={contest.id} />

        {isOwned ? (
          <></>
        ) : (
          <Button variant="gradient" size="xs" onClick={handleClickSubmit}>
            Xem chi tiết
          </Button>
        )}
      </Group>

      <ContestDetail ref={ref} />
    </Paper>
  );
};

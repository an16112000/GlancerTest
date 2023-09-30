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
import type { Category, Job, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";

import { useRefPortal } from "../../../../hooks";
import { formatName, formatPrice } from "../../../../utils/formatter";
import { JobDetail } from "./job-detail";
import { TopSection } from "./top-section";
import { TotalBid } from "./total-bid";

type Props = PaperProps & {
  job: Job & {
    owner: User;
    category: Category;
  };
};

export const JobCard: React.FC<Props> = ({ job, ...props }) => {
  const ref = useRefPortal<typeof JobDetail>();

  const handleClickDetail = () => {
    ref.current?.openModal(job);
  };

  return (
    <Paper withBorder sx={{ overflow: "hidden" }} {...props}>
      <Box px="xl" pt="lg">
        <TopSection categoryName={job.category.name} jobId={job.id} ownerId={job.ownerId} />

        <Title order={3}>{job.name}</Title>

        <Group position="apart">
          <Link href={`/profile/client/${job.owner.id}`} target="_blank" rel="noopener noreferrer">
            <Group spacing="xs" my="md">
              <Avatar size="md" radius="xl" src={job.owner.image}>
                {formatName(job.owner.name)}
              </Avatar>

              <Box>
                <Text size="sm" fw={600}>
                  {job.owner.name}
                </Text>

                <Text size="xs">{moment(job.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
              </Box>
            </Group>
          </Link>

          <Text fw="bold">{formatPrice(job.budget)}</Text>
        </Group>

        <TypographyStylesProvider fz="sm">
          <div dangerouslySetInnerHTML={{ __html: job.info }} />
        </TypographyStylesProvider>
      </Box>

      <Divider />

      <Group position="apart" px="xl" py="sm">
        <TotalBid jobId={job.id} />

        <Button variant="gradient" size="xs" onClick={handleClickDetail}>
          Xem chi tiết
        </Button>
      </Group>

      <JobDetail ref={ref} />
    </Paper>
  );
};

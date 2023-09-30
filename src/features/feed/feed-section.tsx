import { Box, type BoxProps, Flex, LoadingOverlay, Tabs } from "@mantine/core";
import { nanoid } from "nanoid";
import React from "react";

import { Section } from "../../components";
import type { FilterFeedProps } from "../../types";
import { api } from "../../utils/api";
import { ContestCard } from "./components/contest";
import { JobCard } from "./components/job";

type Props = BoxProps & {
  filter: FilterFeedProps;
};

export const FeedSection: React.FC<Props> = ({ filter, ...props }) => {
  const { data: listJob, isLoading: isLoadingJob } = api.job.getAll.useQuery(filter, {
    refetchOnWindowFocus: false,
  });
  const { data: listContest, isLoading: isLoadingContest } = api.contest.getAll.useQuery(filter, {
    refetchOnWindowFocus: false,
  });

  return (
    <Box {...props}>
      <LoadingOverlay visible={isLoadingJob || isLoadingContest} />

      <Section size={600}>
        <Tabs defaultValue="job">
          <Tabs.List grow mb="xl">
            <Tabs.Tab value="job">Công việc</Tabs.Tab>

            <Tabs.Tab value="contest">Cuộc thi</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="job">
            <Flex direction="column" gap="md">
              {listJob?.map((item) => (
                <JobCard key={nanoid()} job={item} />
              ))}
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="contest">
            <Flex direction="column" gap="md">
              {listContest?.map((item) => (
                <ContestCard key={nanoid()} contest={item} />
              ))}
            </Flex>
          </Tabs.Panel>
        </Tabs>
      </Section>
    </Box>
  );
};

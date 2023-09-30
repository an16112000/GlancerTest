import { Flex } from "@mantine/core";
import { type NextPage } from "next";
import { useState } from "react";

import { Section } from "../../components";
import { FeedSection, MainFilterSection } from "../../features/feed";
import { useProtectedPage } from "../../hooks";
import type { FilterFeedProps } from "../../types";

const Feed: NextPage = () => {
  const [filter, setFilter] = useState<FilterFeedProps>({});
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section py={0} pos="relative">
      <Flex>
        <MainFilterSection setFilter={setFilter} />

        <FeedSection sx={{ flex: 1 }} filter={filter} />
      </Flex>
    </Section>
  );
};

export default Feed;

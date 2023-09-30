import { Box, Title } from "@mantine/core";
import { type NextPage } from "next";
import { useState } from "react";

import { Section } from "../components";
import { FilterBar, ListService } from "../features/all-services";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const [filterValues, setFilterValues] = useState<{
    categoryId: string | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    searchString: string | undefined;
  }>({
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    searchString: undefined,
  });
  const { data: services, isLoading } = api.service.getAll.useQuery(filterValues);

  return (
    <Section>
      <Title order={2}>Tất cả dịch vụ</Title>

      <Box mt={20} mb={40}>
        <FilterBar setFilterValues={setFilterValues} />
      </Box>

      <ListService dataSource={services} isLoading={isLoading} />
    </Section>
  );
};

export default Home;

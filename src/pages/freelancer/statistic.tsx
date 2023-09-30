import { Grid } from "@mantine/core";
import { type NextPage } from "next";

import { Section } from "../../components";
import { RevenueChart, ServiceQuality, TotalApplied, TotalEarned, TotalReview } from "../../features/statistic";
import { useProtectedPage } from "../../hooks";

const Statistic: NextPage = () => {
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Grid mb="md">
        <Grid.Col span={4}>
          <TotalEarned />
        </Grid.Col>

        <Grid.Col span={4}>
          <TotalReview />
        </Grid.Col>

        <Grid.Col span={4}>
          <TotalApplied />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <ServiceQuality />
        </Grid.Col>

        <Grid.Col span={8}>
          <RevenueChart />
        </Grid.Col>
      </Grid>
    </Section>
  );
};

export default Statistic;

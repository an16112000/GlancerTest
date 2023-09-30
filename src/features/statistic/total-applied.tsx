import { Group, LoadingOverlay, Paper, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";

import { IconTotalApplied } from "../../assets/vectors";
import { useTheme } from "../../hooks";
import { api } from "../../utils/api";
import { formatPrice } from "../../utils/formatter";
import { IconUpDown } from "./components";

export const TotalApplied = () => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { data, isLoading } = api.statistic.getTotalDoneOrderComparedToLastMonth.useQuery(
    { id: session?.user?.id || "" },
    { enabled: !!session && !!session.user },
  );

  return (
    <Paper radius="md" p="md" withBorder={theme === "dark"} pos="relative">
      <LoadingOverlay visible={isLoading} />

      <Group position="apart">
        <Title order={4}>Đã tham gia</Title>

        <IconTotalApplied />
      </Group>

      <Group spacing="xs" align="end" mt="md">
        <Text fz="2rem" fw="bold">
          {formatPrice(data?.totalOrderDoneThisMonth, "")}
        </Text>

        {!(data && isNaN(data.ratioComparedToLastMonth)) && (
          <Text c={!!data?.totalOrderDoneThisMonthIsHigher ? "green" : "red"} fw={600} mb={5}>
            {data?.ratioComparedToLastMonth.toFixed(2)}% <IconUpDown isUp={data?.totalOrderDoneThisMonthIsHigher} />
          </Text>
        )}
      </Group>

      <Text c={theme === "light" ? "#7C8493" : ""}>so với tháng trước</Text>
    </Paper>
  );
};

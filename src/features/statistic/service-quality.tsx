import { Box, LoadingOverlay, Paper, Progress, Text, Title } from "@mantine/core";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { useTheme } from "../../hooks";
import { api } from "../../utils/api";

export const ServiceQuality = () => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { data: responseRate, isLoading: isLoadingResponseRate } = api.statistic.getServiceOrderResponseRate.useQuery(
    { id: session?.user?.id || "" },
    { enabled: !!session && !!session.user },
  );
  const { data: doneRate, isLoading: isLoadingDoneRate } = api.statistic.getOrderCompletionRate.useQuery(
    { id: session?.user?.id || "" },
    { enabled: !!session && !!session.user },
  );

  const data = useMemo(
    () => [
      {
        label: "Tỉ lệ phản hồi yêu cầu",
        value: responseRate?.rate || 0,
      },
      {
        label: "Tỉ lệ hoàn thành yêu cầu",
        value: doneRate?.rate || 0,
      },
    ],
    [doneRate, responseRate],
  );

  return (
    <Paper radius="md" p="md" withBorder={theme === "dark"} pos="relative">
      <LoadingOverlay visible={isLoadingDoneRate || isLoadingResponseRate} />

      <Title order={4} mb="xs">
        Chất lượng dịch vụ
      </Title>

      <Box display="table">
        {data.map((item) => (
          <Cell key={nanoid()} {...item} />
        ))}
      </Box>
    </Paper>
  );
};

const Cell = ({ label, value }: { label: string; value: number }) => (
  <Box display="table-row">
    <Box display="table-cell" sx={{ whiteSpace: "nowrap" }} pr="xl" pt="xs">
      <Text>{label}</Text>
    </Box>

    <Box display="table-cell" w="99%">
      <Progress value={value} />
    </Box>

    <Box display="table-cell" sx={{ whiteSpace: "nowrap" }} pl="xs">
      <Text>{value.toFixed(1)}%</Text>
    </Box>
  </Box>
);

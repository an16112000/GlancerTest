import { Box, Center, Group, LoadingOverlay, Paper, Select, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { revenueChartptions } from "../../constants";
import { useTheme } from "../../hooks";
import { api } from "../../utils/api";

export const RevenueChart = () => {
  const theme = useTheme();
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = React.useState<string | null | undefined>(revenueChartptions[0]?.value);
  const { data: dataSource, isLoading } = api.statistic.getRevenueChart.useQuery(
    { id: session?.user?.id || "", dayRange: selectedOption || "" },
    { enabled: !!session && !!session.user && !!selectedOption },
  );

  return (
    <Paper radius="md" p="md" withBorder={theme === "dark"}>
      <Group position="apart" mb="xs">
        <Title order={4}>Thống kê doanh thu</Title>

        <Select data={revenueChartptions} value={selectedOption} onChange={setSelectedOption} />
      </Group>

      <Box pos="relative" pt="md">
        <LoadingOverlay visible={isLoading} />

        {dataSource && dataSource.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataSource}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Tổng cộng" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Center h={400} fz="1.2rem" fw="bold" tt="uppercase">
            Không có dữ liệu
          </Center>
        )}
      </Box>
    </Paper>
  );
};

import { Box, type ColorScheme, Group, SegmentedControl, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { nanoid } from "nanoid";
import { type NextPage } from "next";
import { useState } from "react";

import { Section } from "../components";
import { keys } from "../constants";
import { OrderContestList, OrderJobList, OrderServiceList } from "../features/orders";
import { useProtectedPage } from "../hooks";

enum TabKey {
  JOB,
  SERVICE,
  CONTEST,
}

const tab = [
  {
    label: "Dịch vụ",
    value: TabKey.SERVICE,
    component: <OrderServiceList />,
  },
  {
    label: "Công việc",
    value: TabKey.JOB,
    component: <OrderJobList />,
  },
  {
    label: "Cuộc thi",
    value: TabKey.CONTEST,
    component: <OrderContestList />,
  },
];

const Orders: NextPage = () => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });
  const [selectedSegmented, setSelectedSegmented] = useState(tab[0]?.value.toString());
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section size={1600}>
      <Group position="apart" mb="md">
        <Title order={2}>Danh sách yêu cầu</Title>

        <SegmentedControl
          bg={theme === "light" ? "#fff" : ""}
          color="violet"
          data={tab.map((item) => ({ label: item.label, value: item.value.toString() }))}
          value={selectedSegmented}
          onChange={setSelectedSegmented}
        />
      </Group>

      <Box pos="relative">
        {tab.map((item) =>
          item.value.toString() === selectedSegmented ? (
            <Box key={nanoid()}>{item.component}</Box>
          ) : (
            <Box key={nanoid()}></Box>
          ),
        )}
      </Box>
    </Section>
  );
};

export default Orders;

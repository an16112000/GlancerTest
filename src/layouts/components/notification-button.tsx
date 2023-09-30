import { Button, Indicator, Popover, Tabs, Title } from "@mantine/core";
import { IconBell } from "@tabler/icons";
import { useState } from "react";

import { NotificationCard } from "./notification-card";

enum TabType {
  ALL = "Tất cả",
  UNSEEN = "Chưa đọc",
  SEEN = "Đã đọc",
}

export const NotificationButton = () => {
  const [count] = useState(1);

  const renderTabList = () =>
    Object.entries(TabType).map(([key, value]) => (
      <Tabs.Tab key={key} value={value}>
        {value}
      </Tabs.Tab>
    ));

  return (
    <Popover width={350} withArrow={false} position="bottom-end">
      <Popover.Target>
        <Indicator color="red" label={count} size={14} showZero={false} dot={false}>
          <Button variant="subtle" px={6}>
            <IconBell />
          </Button>
        </Indicator>
      </Popover.Target>

      <Popover.Dropdown>
        <Title order={2} mb={20}>
          Thông báo
        </Title>

        <Tabs variant="pills" radius="xl" defaultValue={TabType.ALL}>
          <Tabs.List mb={10}>{renderTabList()}</Tabs.List>

          <Tabs.Panel value={TabType.ALL} pt="xs">
            <NotificationCard content="Thong bao so 1" />
          </Tabs.Panel>

          <Tabs.Panel value={TabType.UNSEEN} pt="xs">
            Thông báo chưa đọc
          </Tabs.Panel>

          <Tabs.Panel value={TabType.SEEN} pt="xs">
            Thông báo đã đọc
          </Tabs.Panel>
        </Tabs>
      </Popover.Dropdown>
    </Popover>
  );
};

import { Tabs, Title } from "@mantine/core";
import { nanoid } from "nanoid";
import { type NextPage } from "next";

import { Section } from "../components";
import { FavoriteServices, SavedContests, SavedJobs } from "../features/save-list";
import { useProtectedPage } from "../hooks";

const tabList = [
  {
    value: "service",
    label: "Dịch vụ",
    component: <FavoriteServices />,
  },
  {
    value: "job",
    label: "Công việc",
    component: <SavedJobs />,
  },
  {
    value: "contest",
    label: "Cuộc thi",
    component: <SavedContests />,
  },
];

const SaveList: NextPage = () => {
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Title order={2} mb="md">
        Danh sách đã lưu
      </Title>

      <Tabs defaultValue={tabList[0]?.value}>
        <Tabs.List mb="md">
          {tabList.map(({ value, label }) => (
            <Tabs.Tab key={nanoid()} value={value}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabList.map(({ value, component }) => (
          <Tabs.Panel key={nanoid()} value={value}>
            {component}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Section>
  );
};

export default SaveList;

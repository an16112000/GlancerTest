import { ActionIcon, Box, Flex, Menu,  Text } from "@mantine/core";
import { IconCheck, IconDots } from "@tabler/icons";

type Props = {
  content: string;
};

export const NotificationCard: React.FC<Props> = ({ content }) => {
  return (
    <Flex gap="xs" p="xs" sx={{ border: "1px solid #ffffff10", borderRadius: 5 }} align="center">
      <Box sx={{ flex: 1 }}>
        <Text lineClamp={3} mb="xs">
          {content}
        </Text>

        <Text size="xs">1 ngày trước</Text>
      </Box>

      <ActionButton />
    </Flex>
  );
};

const ActionButton = () => (
  <Menu shadow="md" width={200}>
    <Menu.Target>
      <ActionIcon radius="xl" size="lg">
        <IconDots />
      </ActionIcon>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item icon={<IconCheck />}>Đánh dấu đã đọc</Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

import { Group, Text } from "@mantine/core";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";

const menu = [
  {
    title: "Tìm kiếm công việc & cuộc thi",
    link: "/freelancer",
  },
  {
    title: "Quản lý dịch vụ",
    link: "/freelancer/my-services",
  },
  {
    title: "Thống kê",
    link: "/freelancer/statistic",
  },
];

export const MenuFreelancer: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <Group spacing="xl" fw={500}>
      {menu.map((item) => (
        <Link key={nanoid()} href={item.link}>
          <Text
            color={pathname === item.link ? "violet" : ""}
            fw="bold"
            sx={{
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                color: "#7950f2",
              },
            }}
          >
            {item.title}
          </Text>
        </Link>
      ))}
    </Group>
  );
};

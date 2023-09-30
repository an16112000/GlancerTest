import { Group, Text } from "@mantine/core";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";

const menu = [
  {
    title: "Tìm kiếm dịch vụ",
    link: "/",
  },
  {
    title: "Quản lý công việc",
    link: "/my-jobs",
  },
  {
    title: "Quản lý cuộc thi",
    link: "/my-contests",
  },
];

export const MenuClient: React.FC = () => {
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

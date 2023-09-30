import { Avatar, type ColorScheme, Menu } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconBookmark,
  IconCreditCard,
  IconList,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";

import { keys } from "../../constants";
import { api } from "../../utils/api";
import { formatName } from "../../utils/formatter";

export const AvatarButton: React.FC = () => {
  const { data: session } = useSession();
  const { data: userInfo } = api.user.getById.useQuery(
    { id: session?.user?.id || "" },
    { enabled: !!session?.user?.id, refetchOnWindowFocus: false },
  );
  const [theme, setTheme] = useLocalStorage<ColorScheme>({
    key: keys.COLOR_SCHEME,
    defaultValue: "dark",
  });

  const currentTheme = useMemo(() => (theme == "light" ? "Giao diện tối" : "Giao diện sáng"), [theme]);
  const themIcon = useMemo(() => (theme == "light" ? <IconMoon size="0.9rem" /> : <IconSun size="0.9rem" />), [theme]);

  const handleSwitchTheme = () => setTheme(theme == "dark" ? "light" : "dark");
  const handleSignIn = () => void signIn("google");
  const handleSignOut = () => void signOut();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar variant="filled" radius="xl" src={userInfo?.image} style={{ cursor: "pointer" }}>
          {formatName(userInfo?.name)}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Giao diện</Menu.Label>

        <Menu.Item icon={themIcon} onClick={handleSwitchTheme}>
          {currentTheme}
        </Menu.Item>

        <Menu.Divider />

        {session ? (
          <>
            <Menu.Label>@{userInfo?.name}</Menu.Label>

            <Link href="/save-list">
              <Menu.Item icon={<IconBookmark size="0.9rem" />}>Đã lưu</Menu.Item>
            </Link>

            <Link href="/orders">
              <Menu.Item icon={<IconList size="0.9rem" />}>Quản lý yêu cầu</Menu.Item>
            </Link>

            <Link href="/transactions">
              <Menu.Item icon={<IconCreditCard size="0.9rem" />}>Lịch sử giao dịch</Menu.Item>
            </Link>

            <Link href="/settings">
              <Menu.Item icon={<IconSettings size="0.9rem" />}>Cài đặt</Menu.Item>
            </Link>

            <Menu.Divider />

            <Menu.Item color="red" icon={<IconLogout size="0.9rem" />} onClick={handleSignOut}>
              Đăng xuất
            </Menu.Item>
          </>
        ) : (
          <Menu.Item icon={<IconLogin size="0.9rem" />} onClick={handleSignIn}>
            Đăng nhập
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

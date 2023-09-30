import { AspectRatio, Button, Flex, Group, Header as MtHeader } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { Logo } from "../assets/vectors";
import { AvatarButton, MenuClient, MenuFreelancer, MessageButton } from "./components";

export const Header = () => {
  const { status } = useSession();
  const { pathname } = useRouter();

  const isUnauthenticated = useMemo(() => status === "unauthenticated", [status]);
  const isFreelancerMode = useMemo(() => pathname.includes("/freelancer"), [pathname]);
  const linkSwitch = useMemo(() => (isFreelancerMode ? "/" : "/freelancer"), [isFreelancerMode]);
  const linkHome = useMemo(() => (isFreelancerMode ? "/freelancer" : "/"), [isFreelancerMode]);
  const textSwitch = useMemo(() => (isFreelancerMode ? "khách hàng" : "freelancer"), [isFreelancerMode]);

  const renderMenu = useCallback(() => {
    if (isUnauthenticated) return <></>;

    if (isFreelancerMode) return <MenuFreelancer />;

    return <MenuClient />;
  }, [isFreelancerMode, isUnauthenticated]);

  return (
    <MtHeader height={60} p="md" zIndex={101} pos="sticky" top={0}>
      <Flex h="100%" justify="space-between" align="center">
        <Link href={linkHome}>
          <AspectRatio ratio={128 / 36} w={128}>
            <Logo />
          </AspectRatio>
        </Link>

        {renderMenu()}

        <Group>
          {!isUnauthenticated && (
            <>
              <Link href={linkSwitch}>
                <Button variant="outline">Chế độ {textSwitch}</Button>
              </Link>

              {pathname !== "/chat" && <MessageButton />}

              {/* <NotificationButton /> */}
            </>
          )}

          <AvatarButton />
        </Group>
      </Flex>
    </MtHeader>
  );
};

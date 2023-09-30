import { Avatar, type ColorScheme, Group, LoadingOverlay, Paper, type PaperProps, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { keys } from "../../../constants";
import { api } from "../../../utils/api";
import { formatName } from "../../../utils/formatter";

type Props = PaperProps & {
  id: string;
  members: string[];
  onSelect: (otherPerson: User) => void;
};

const _ConversationCard: React.FC<Props> = ({ members, onSelect, id, ...props }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });

  const isActive = useMemo(() => router.query.id === id, [id, router.query.id]);

  const otherPersonId = useMemo(() => {
    if (session && session.user) {
      return members.find((userId) => userId !== session?.user?.id);
    }
  }, [members, session]);

  const { data: otherPerson, isLoading } = api.user.getById.useQuery(
    { id: otherPersonId || "" },
    {
      enabled: !!otherPersonId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  React.useEffect(() => {
    const { query } = router;

    const queryId = query.id;

    if (queryId && queryId === id && otherPerson) {
      onSelect(otherPerson);
    }
  }, [id, onSelect, otherPerson, router]);

  const handleClick = () => {
    const { query } = router;

    if (query && query.id !== id) {
      void router.push({
        query: { id },
      });
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      {otherPerson && (
        <Paper
          shadow="xs"
          withBorder={theme === "dark"}
          p="xs"
          sx={{ cursor: "pointer" }}
          bg={isActive ? (theme === "dark" ? "rgba(25, 113, 194, 0.2)" : "rgba(231, 245, 255, 1)") : "tranparent"}
          onClick={handleClick}
          mb="xs"
          {...props}
        >
          <Group spacing="xs">
            <Avatar src={otherPerson.image} radius="xl" size="md">
              {formatName(otherPerson.name)}
            </Avatar>

            <Text fw="bold">{otherPerson.name}</Text>
          </Group>
        </Paper>
      )}
    </>
  );
};

export const ConversationCard = React.memo(_ConversationCard);

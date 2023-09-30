import { Button, Group, Input, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import type { Contest } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { type ElementRef, useRef, useState } from "react";

import { Section } from "../components";
import { ConfigContest, ListContest } from "../features/my-contests";
import { useProtectedPage } from "../hooks";
import { api } from "../utils/api";

type RefConfig = ElementRef<typeof ConfigContest>;

const MyContests: NextPage = () => {
  const { data: session } = useSession();
  const configRef = useRef<RefConfig>(null);
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebouncedValue(searchString, 200);
  const {
    data: services,
    isLoading,
    refetch,
  } = api.contest.getAll.useQuery(
    {
      ownerId: session?.user?.id,
      searchString: debouncedSearchString,
    },
    {
      enabled: !!session?.user?.id,
      refetchOnWindowFocus: false,
    },
  );
  const { isAuthenticating } = useProtectedPage();

  const handleCreate = () => {
    configRef.current?.openDrawer();
  };

  const handleEdit = (data: Contest) => {
    configRef.current?.openDrawer(data);
  };

  const handleConfigSuccess = async () => {
    if (searchString) setSearchString("");
    else await refetch();
  };

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Group position="apart" mb="md">
        <Title order={2}>Danh sách cuộc thi</Title>

        <Group>
          <Input placeholder="Tên cuộc thi..." onChange={(e) => setSearchString(e.target.value)} />

          <Button onClick={handleCreate}>Thêm mới</Button>
        </Group>
      </Group>

      <ListContest
        dataSource={services || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onArchiveSuccess={handleConfigSuccess}
      />

      <ConfigContest ref={configRef} onSuccess={handleConfigSuccess} />
    </Section>
  );
};

export default MyContests;

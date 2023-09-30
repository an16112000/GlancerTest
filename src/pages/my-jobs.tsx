import { Button, Group, Input, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import type { Job } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { type ElementRef, useRef, useState } from "react";

import { Section } from "../components";
import { ConfigJob, ListJob } from "../features/my-jobs";
import { useProtectedPage } from "../hooks";
import { api } from "../utils/api";

type RefConfig = ElementRef<typeof ConfigJob>;

const MyJobs: NextPage = () => {
  const { data: session } = useSession();
  const configRef = useRef<RefConfig>(null);
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebouncedValue(searchString, 200);
  const {
    data: jobs,
    isLoading,
    refetch,
  } = api.job.getAll.useQuery(
    {
      ownerId: session?.user?.id,
      searchString: debouncedSearchString,
    },
    { refetchOnWindowFocus: false },
  );
  const { isAuthenticating } = useProtectedPage();

  const handleCreate = () => {
    configRef.current?.openDrawer();
  };

  const handleEdit = (data: Job) => {
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
        <Title order={2}>Danh sách công việc</Title>

        <Group>
          <Input placeholder="Tên công việc..." onChange={(e) => setSearchString(e.target.value)} />

          <Button onClick={handleCreate}>Thêm mới</Button>
        </Group>
      </Group>

      <ListJob
        dataSource={jobs || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onArchiveSuccess={handleConfigSuccess}
      />

      <ConfigJob ref={configRef} onSuccess={handleConfigSuccess} />
    </Section>
  );
};

export default MyJobs;

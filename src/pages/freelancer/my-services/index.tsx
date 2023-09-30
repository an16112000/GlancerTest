import { Button, Group, Input, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import { Section } from "../../../components";
import { ListService } from "../../../features/my-services";
import { useProtectedPage } from "../../../hooks";
import { api } from "../../../utils/api";

const MyServices: NextPage = () => {
  const { data: session } = useSession();
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebouncedValue(searchString, 200);
  const {
    data: services,
    isLoading,
    refetch,
  } = api.service.getAll.useQuery({
    ownerId: session?.user?.id,
    searchString: debouncedSearchString,
  });
  const { isAuthenticating } = useProtectedPage();

  const handleConfigSuccess = async () => {
    if (searchString) setSearchString("");
    else await refetch();
  };

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Group position="apart" mb="md">
        <Title order={2}>Danh sách dịch vụ</Title>

        <Group>
          <Input placeholder="Tên dịch vụ..." onChange={(e) => setSearchString(e.target.value)} />

          <Link href="my-services/new-service">
            <Button>Thêm mới</Button>
          </Link>
        </Group>
      </Group>

      <ListService dataSource={services} isLoading={isLoading} onArchiveSuccess={handleConfigSuccess} />
    </Section>
  );
};

export default MyServices;

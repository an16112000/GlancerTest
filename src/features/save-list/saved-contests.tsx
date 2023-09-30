import { ActionIcon, Box, Center, Group, LoadingOverlay, Paper, Table } from "@mantine/core";
import type { Category, Contest, SavedContest, User } from "@prisma/client";
import { IconEye } from "@tabler/icons";
import moment from "moment";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { useRefPortal } from "../../hooks";
import { api } from "../../utils/api";
import { formatPrice } from "../../utils/formatter";
import { ContestDetail } from "../feed/components/contest";
import { ButtonUnsaveContest } from "./components";

type PropsData = SavedContest & {
  contest: Contest & {
    owner: User;
    category: Category;
  };
};

export const SavedContests = () => {
  const previewRef = useRefPortal<typeof ContestDetail>();
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.saveContest.getAll.useQuery(
    { userId: session?.user?.id || "" },
    { enabled: !!session?.user?.id },
  );
  const [dataSource, setDataSource] = useState<PropsData[]>([]);

  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);

  const ths = (
    <tr>
      <th>Tên cuộc thi</th>
      <th>Giải thưởng</th>
      <th>Ngày tạo</th>
      <th>Ngày sửa</th>
      <th></th>
    </tr>
  );

  const handlePreview = (
    contest: Contest & {
      category: Category;
      owner: User;
    },
  ) => {
    previewRef.current?.openModal(contest);
  };

  const handleRemoveFromDataSource = (contestId: string) => {
    setDataSource((list) => list.filter((item) => item.contestId !== contestId));
  };

  const rows = dataSource?.map((item) => (
    <tr key={nanoid()}>
      <td>{item.contest.name}</td>
      <td>{formatPrice(item.contest.budget)}</td>
      <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>
        <Group>
          <ActionIcon color="blue" variant="filled" onClick={() => handlePreview(item.contest)}>
            <IconEye size="1rem" />
          </ActionIcon>

          <ButtonUnsaveContest
            onSuccess={() => handleRemoveFromDataSource(item.contestId)}
            freelancerId={item.freelancerId}
            contestId={item.contestId}
          />
        </Group>
      </td>
    </tr>
  ));

  return (
    <Box pos="relative" mih={150}>
      <LoadingOverlay visible={isLoading} />

      {!isLoading && !dataSource?.length ? (
        <Center mih={150} fw="bold" fz="1.2rem" tt="uppercase">
          Trống
        </Center>
      ) : (
        <Paper radius="md" pt={5}>
          <Table highlightOnHover>
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
          </Table>
        </Paper>
      )}

      <ContestDetail
        ref={previewRef}
        onSaveSuccess={async () => {
          await refetch();
        }}
        onUnsaveSuccess={handleRemoveFromDataSource}
      />
    </Box>
  );
};

import { ActionIcon, Box, Center, Group, LoadingOverlay, Paper, Table } from "@mantine/core";
import type { Category, Job, SavedJob, User } from "@prisma/client";
import { IconEye } from "@tabler/icons";
import moment from "moment";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { useRefPortal } from "../../hooks";
import { api } from "../../utils/api";
import { formatPrice } from "../../utils/formatter";
import { JobDetail } from "../feed/components/job";
import { ButtonUnsaveJob } from "./components";

type PropsData = SavedJob & {
  job: Job & {
    category: Category;
    owner: User;
  };
};

export const SavedJobs = () => {
  const previewRef = useRefPortal<typeof JobDetail>();
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.saveJob.getAll.useQuery(
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
      <th>Tên công việc</th>
      <th>Mức chi</th>
      <th>Ngày tạo</th>
      <th>Ngày sửa</th>
      <th></th>
    </tr>
  );

  const handlePreview = (
    job: Job & {
      category: Category;
      owner: User;
    },
  ) => {
    previewRef.current?.openModal(job);
  };

  const handleRemoveFromDataSource = (jobId: string) => {
    setDataSource((list) => list.filter((item) => item.jobId !== jobId));
  };

  const rows = dataSource?.map((item) => (
    <tr key={nanoid()}>
      <td>{item.job.name}</td>
      <td>{formatPrice(item.job.budget)}</td>
      <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>
        <Group>
          <ActionIcon color="blue" variant="filled" onClick={() => handlePreview(item.job)}>
            <IconEye size="1rem" />
          </ActionIcon>

          <ButtonUnsaveJob
            onSuccess={() => handleRemoveFromDataSource(item.jobId)}
            freelancerId={item.freelancerId}
            jobId={item.jobId}
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

      <JobDetail
        ref={previewRef}
        onSaveSuccess={async () => {
          await refetch();
        }}
        onUnsaveSuccess={handleRemoveFromDataSource}
      />
    </Box>
  );
};

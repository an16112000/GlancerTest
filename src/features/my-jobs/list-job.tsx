import { ActionIcon, Badge, Box, Center, Group, LoadingOverlay, Paper, Table, Tooltip } from "@mantine/core";
import type { BidJob, Category, Job, User } from "@prisma/client";
import { IconEdit, IconHandStop } from "@tabler/icons";
import moment from "moment";
import { nanoid } from "nanoid";
import React from "react";

import { useRefPortal } from "../../hooks";
import { formatPrice } from "../../utils/formatter";
import { ArchiveButton } from "./components";
import { ModalBidList } from "./components/modal-bid-list";

type PropsData = Job & {
  category: Category;
  owner: User;
  bidList: BidJob[];
};

type Props = {
  dataSource: PropsData[];
  isLoading: boolean;
  onEdit: (data: Job) => void;
  onArchiveSuccess: () => Promise<void>;
};

export const ListJob: React.FC<Props> = ({ dataSource, isLoading, onEdit, onArchiveSuccess }) => {
  const bidListRef = useRefPortal<typeof ModalBidList>();
  const handleOpenBidList = (jobId: string) => {
    bidListRef.current?.openModal(jobId);
  };

  const ths = (
    <tr>
      <th>Tên công việc</th>
      <th>Danh mục</th>
      <th>Mức chi</th>
      <th>SL chào giá</th>
      <th>Ngày tạo</th>
      <th>Ngày sửa</th>
      <th></th>
    </tr>
  );

  const rows = dataSource?.map((item) => (
    <tr key={nanoid()}>
      <td>{item.name}</td>
      <td>
        <Badge>{item.category.name}</Badge>
      </td>
      <td>{formatPrice(item.budget)}</td>
      <td>{item.bidList.length}</td>
      <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>
        <Group>
          {item.bidList.length && (
            <Tooltip label="Xem báo giá">
              <ActionIcon color="green" variant="filled" onClick={() => handleOpenBidList(item.id)}>
                <IconHandStop size="1rem" />
              </ActionIcon>
            </Tooltip>
          )}

          <Tooltip label="Chỉnh sửa">
            <ActionIcon color="blue" variant="filled" onClick={() => onEdit(item)}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>

          <ArchiveButton jobId={item.id} onSuccess={onArchiveSuccess} />
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <Paper radius="md" pt={5}>
        <Table highlightOnHover>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>

        {!isLoading && !dataSource?.length && (
          <Center mih={150} fw="bold" tt="uppercase">
            Trống
          </Center>
        )}
      </Paper>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} />
      </Box>

      <ModalBidList ref={bidListRef} />
    </>
  );
};

import { ActionIcon, Badge, Box, Center, Group, LoadingOverlay, Paper, Table, Tooltip } from "@mantine/core";
import type { Category, Contest, ProductContest, User } from "@prisma/client";
import { IconEdit, IconHandStop } from "@tabler/icons";
import moment from "moment";
import { nanoid } from "nanoid";
import React from "react";

import { useRefPortal } from "../../hooks";
import { formatPrice } from "../../utils/formatter";
import { ArchiveButton, ModalProductList } from "./components";

type PropsData = Contest & {
  category: Category;
  owner: User;
  products: (ProductContest & {
    freelancer: User;
  })[];
};

type Props = {
  dataSource: PropsData[];
  isLoading: boolean;
  onEdit: (data: Contest) => void;
  onArchiveSuccess: () => Promise<void>;
};

export const ListContest: React.FC<Props> = ({ dataSource, isLoading, onEdit, onArchiveSuccess }) => {
  const ref = useRefPortal<typeof ModalProductList>();

  const handleOpenProductList = (id: string) => {
    ref.current?.openModal(id);
  };

  const ths = (
    <tr>
      <th>Tên cuộc thi</th>
      <th>Danh mục</th>
      <th>Mức chi</th>
      <th>SL ứng tuyển</th>
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
      <td>{item.products.length}</td>
      <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>
        <Group>
          {item.products.length && (
            <Tooltip label="Xem sản phẩm">
              <ActionIcon color="green" variant="filled" onClick={() => handleOpenProductList(item.id)}>
                <IconHandStop size="1rem" />
              </ActionIcon>
            </Tooltip>
          )}

          <Tooltip label="Chỉnh sửa">
            <ActionIcon color="blue" variant="filled" onClick={() => onEdit(item)}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>

          <ArchiveButton contestId={item.id} onSuccess={onArchiveSuccess} />
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

      <ModalProductList ref={ref} />
    </>
  );
};

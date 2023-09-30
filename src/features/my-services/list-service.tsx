import { ActionIcon, Box, Center, Group, LoadingOverlay, Paper, Table, Tooltip } from "@mantine/core";
import type { Category, Service, User } from "@prisma/client";
import { IconEdit } from "@tabler/icons";
import moment from "moment";
import { nanoid } from "nanoid";
import Link from "next/link";
import React from "react";

import { formatPrice } from "../../utils/formatter";
import { ArchiveButton } from "./components";

type Props = {
  dataSource:
    | (Service & {
        category: Category;
        owner: User;
      })[]
    | undefined;
  isLoading: boolean;
  onArchiveSuccess: () => Promise<void>;
};

export const ListService: React.FC<Props> = ({ dataSource, isLoading, onArchiveSuccess }) => {
  const ths = (
    <tr>
      <th>Tên dịch vụ</th>
      <th>Giá dịch vụ</th>
      <th>Ngày tạo</th>
      <th>Ngày sửa</th>
      <th></th>
    </tr>
  );

  const rows = dataSource?.map((item) => (
    <tr key={nanoid()}>
      <td>{item.name}</td>
      <td>{formatPrice(item.price)}</td>
      <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
      <td>
        <Group>
          <Tooltip label="Chỉnh sửa">
            <Link href={`/freelancer/my-services/${item.id}`}>
              <ActionIcon color="blue" variant="filled">
                <IconEdit size={16} />
              </ActionIcon>
            </Link>
          </Tooltip>

          <ArchiveButton serviceId={item.id} onSuccess={onArchiveSuccess} />
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
    </>
  );
};

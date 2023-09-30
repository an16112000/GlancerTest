import { Avatar, Box, Center, Group, LoadingOverlay, Paper, Table, Text, Title } from "@mantine/core";
import moment from "moment";
import { nanoid } from "nanoid";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import { Section } from "../components";
import { useProtectedPage } from "../hooks";
import { api } from "../utils/api";
import { formatName, formatPrice } from "../utils/formatter";

const Transactions: NextPage = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.transaction.getAll.useQuery(
    { userId: session?.user?.id || "" },
    { enabled: !!session?.user?.id },
  );
  const { isAuthenticating } = useProtectedPage();

  const ths = (
    <tr>
      <th>Mã giao dịch</th>
      <th>Người gửi</th>
      <th>Người nhận</th>
      <th>Số tiền</th>
      <th>Ngày tạo</th>
      {/* <th></th> */}
    </tr>
  );

  const rows = data?.map((item) => {
    const isReceiver = session?.user?.id === item.receiver.id;

    return (
      <tr key={nanoid()}>
        <td>{item.id}</td>
        <td>
          <Group spacing="xs" py="xs">
            <Avatar src={item.sender.image} size="sm" radius="xl">
              {formatName(item.sender.name)}
            </Avatar>
            <Text>{item.sender.name}</Text>
          </Group>
        </td>
        <td>
          <Group spacing="xs" py="xs">
            <Avatar src={item.receiver.image} size="sm" radius="xl">
              {formatName(item.receiver.name)}
            </Avatar>
            <Text>{item.receiver.name}</Text>
          </Group>
        </td>
        <td>
          <Text color={isReceiver ? "green" : "red"} fw="bold">
            {isReceiver ? "+" : "-"}
            {formatPrice(item.amount)}
          </Text>
        </td>
        <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
      </tr>
    );
  });

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Group position="apart" mb="xl">
        <Title order={2}>Lịch sử giao dịch</Title>

        <Group></Group>
      </Group>

      <Paper radius="md" pt={5}>
        <Table highlightOnHover>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>

        {!isLoading && !data?.length && (
          <Center mih={150} fw="bold" tt="uppercase">
            Trống
          </Center>
        )}
      </Paper>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} />
      </Box>
    </Section>
  );
};

export default Transactions;

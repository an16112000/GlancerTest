import { Avatar, Badge, Box, Button, Center, Group, LoadingOverlay, Paper, Table, Text } from "@mantine/core";
import { OrderStatus, Role, TransactionOrderType } from "@prisma/client";
import moment from "moment";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import { contestStatusTabs } from "../../../constants";
import { useRefPortal } from "../../../hooks";
import { api } from "../../../utils/api";
import { formatName, formatPrice } from "../../../utils/formatter";
import { ButtonContact, ModalReviewUser } from "../components";
import { ButtonCancel, ButtonComplete } from "./components";

export const OrderContestList = () => {
  const reviewUserRef = useRefPortal<typeof ModalReviewUser>();
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.orderContest.getAll.useQuery(
    { userId: session?.user?.id || "" },
    { enabled: !!session?.user?.id },
  );
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.DOING);

  const formattedData = useMemo(() => {
    return data?.filter((item) => item.status === selectedStatus) || [];
  }, [data, selectedStatus]);

  const handleReviewFreelancer = (userBeReviewedId: string, orderId: string) => {
    reviewUserRef.current?.openDrawer(userBeReviewedId, orderId, false);
  };

  const handleReviewClient = (userBeReviewedId: string, orderId: string) => {
    reviewUserRef.current?.openDrawer(userBeReviewedId, orderId, true);
  };

  const ths = (
    <tr>
      <th>Mã cuộc thi</th>
      <th>Vai trò</th>
      <th>Giá</th>
      <th>Đối tác</th>
      <th>Trạng thái</th>
      <th>Ngày tạo</th>
      <th>Ngày sửa</th>
      <th></th>
    </tr>
  );

  const rows = formattedData.map((item) => {
    const isClient = item.contest.ownerId === session?.user?.id;
    const isFreelancer = !isClient;

    const partner = isClient ? item.freelancer : item.contest.owner;

    return (
      <tr key={nanoid()}>
        <td>{item.contestId}</td>
        <td>{isFreelancer ? "Freelancer" : "Khách hàng"}</td>
        <td>{formatPrice(item.contest.budget)}</td>
        <td>
          <Link
            href={`/profile/${isFreelancer ? "client" : "freelancer"}/${partner.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group spacing="xs">
              <Avatar size="sm" radius="xl" src={partner.image}>
                {formatName(partner.name)}
              </Avatar>

              <Text>{partner.name}</Text>
            </Group>
          </Link>
        </td>
        <td>
          <Badge>{item.status}</Badge>
        </td>
        <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
        <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
        <td>
          <Group>
            {item.status === OrderStatus.DOING && (
              <Group>
                <ButtonComplete
                  id={item.id}
                  isFreelancer={isFreelancer}
                  onSuccess={() => {
                    void refetch();

                    setSelectedStatus(OrderStatus.COMPLETED);
                  }}
                  disabled={(isClient && !item.freelancerDone) || (isFreelancer && item.freelancerDone)}
                  price={item.contest.budget}
                  productName={item.contest.name}
                  partnerId={partner.id}
                />

                <ButtonCancel
                  isFreelancer={isFreelancer}
                  id={item.id}
                  onSuccess={() => {
                    void refetch();

                    setSelectedStatus(OrderStatus.CANCELED);
                  }}
                  disabled={isFreelancer && item.freelancerDone}
                />
              </Group>
            )}

            {isFreelancer &&
              (item.status === OrderStatus.COMPLETED || item.status === OrderStatus.CANCELED) &&
              item.canceler !== Role.FREELANCER && (
                <Group>
                  <Button
                    disabled={!!item.reviewClientDone}
                    onClick={() => handleReviewClient(item.contest.ownerId, item.id)}
                  >
                    Đánh giá khách hàng
                  </Button>
                </Group>
              )}

            {isClient &&
              (item.status === OrderStatus.COMPLETED || item.status === OrderStatus.CANCELED) &&
              item.canceler !== Role.CLIENT && (
                <Button
                  disabled={!!item.reviewFreelancerDone}
                  onClick={() => handleReviewFreelancer(item.freelancerId, item.id)}
                >
                  Đánh giá freelancer
                </Button>
              )}

            {(item.status === OrderStatus.DOING ||
              item.status === OrderStatus.COMPLETED ||
              item.status === OrderStatus.CANCELED) && (
              <ButtonContact otherPersonId={isClient ? item.freelancerId : item.contest.ownerId} />
            )}
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Group position="apart" mb="md">
        <Group>
          {contestStatusTabs.map((tab) => (
            <Button
              key={nanoid()}
              variant={selectedStatus === tab.type ? "filled" : "outline"}
              onClick={() => selectedStatus !== tab.type && setSelectedStatus(tab.type)}
            >
              {tab.label} ({data?.filter((item) => item.status === tab.type).length || 0})
            </Button>
          ))}
        </Group>
      </Group>

      <Paper radius="md" pt={5}>
        <Table highlightOnHover>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>

        {!isLoading && !formattedData?.length && (
          <Center mih={150} fw="bold" tt="uppercase">
            Trống
          </Center>
        )}
      </Paper>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} />
      </Box>

      <ModalReviewUser ref={reviewUserRef} onSuccess={() => void refetch()} type={TransactionOrderType.CONTEST} />
    </>
  );
};

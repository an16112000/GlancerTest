import { Avatar, Box, Button, Center, Group, LoadingOverlay, Paper, Table, Text } from "@mantine/core";
import { OrderStatus, Role, TransactionOrderType } from "@prisma/client";
import moment from "moment";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type ElementRef, useMemo, useRef, useState } from "react";

import { serviceStatusTabs } from "../../../constants";
import { api } from "../../../utils/api";
import { formatName, formatPrice } from "../../../utils/formatter";
import { BadgeStatus, ButtonContact, ModalReviewUser } from "../components";
import { ButtonApprove, ButtonCancel, ButtonComplete, ButtonReject, ModalReviewService } from "./components";

type RefReviewService = ElementRef<typeof ModalReviewService>;
type RefReviewUser = ElementRef<typeof ModalReviewUser>;

export const OrderServiceList = () => {
  const reviewServiceRef = useRef<RefReviewService>(null);
  const reviewUserRef = useRef<RefReviewUser>(null);
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.orderService.getAll.useQuery(
    { userId: session?.user?.id || "" },
    { enabled: !!session?.user?.id },
  );
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  const formattedData = useMemo(() => {
    return data?.filter((item) => item.status === selectedStatus) || [];
  }, [data, selectedStatus]);

  const handleReviewService = (serviceId: string, orderId: string) => {
    reviewServiceRef.current?.openDrawer(serviceId, orderId);
  };

  const handleReviewFreelancer = (userBeReviewedId: string, orderId: string) => {
    reviewUserRef.current?.openDrawer(userBeReviewedId, orderId, false);
  };

  const handleReviewClient = (userBeReviewedId: string, orderId: string) => {
    reviewUserRef.current?.openDrawer(userBeReviewedId, orderId, true);
  };

  const ths = (
    <tr>
      <th>Mã dịch vụ</th>
      <th>Vai trò</th>
      <th>Giá</th>
      <th>Đối tác</th>
      <th>Trạng thái</th>
      <th>Ngày tạo</th>
      <th>Ngày sửa</th>
      <th></th>
    </tr>
  );

  const rows = formattedData?.map((item) => {
    const isFreelancer = item.service.ownerId === session?.user?.id;
    const isClient = !isFreelancer;

    const partner = isFreelancer ? item.client : item.service.owner;

    return (
      <tr key={nanoid()}>
        <td>
          <Link href={`/services/${item.serviceId}`} target="_blank" rel="noopener noreferrer">
            {item.serviceId}
          </Link>
        </td>
        <td>{isFreelancer ? "Freelancer" : "Khách hàng"}</td>
        <td>{formatPrice(item.service.price)}</td>
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
          <BadgeStatus status={item.status} />
        </td>
        <td>{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
        <td>{moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}</td>
        <td>
          <Group>
            {isFreelancer && item.status === OrderStatus.PENDING && (
              <Group>
                <ButtonApprove
                  id={item.id}
                  onSuccess={() => {
                    void refetch();

                    setSelectedStatus(OrderStatus.DOING);
                  }}
                />

                <ButtonReject id={item.id} onSuccess={() => void refetch()} />
              </Group>
            )}

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
                  price={item.service.price}
                  productName={item.service.name}
                  partnerId={partner.id}
                />

                <ButtonCancel
                  isFreelancer={isFreelancer}
                  id={item.id}
                  onSuccess={() => {
                    void refetch();
                  }}
                  disabled={isFreelancer && item.freelancerDone}
                />
              </Group>
            )}

            {isFreelancer &&
              (item.status === OrderStatus.COMPLETED || item.status === OrderStatus.CANCELED) &&
              item.canceler !== Role.FREELANCER && (
                <Group>
                  <Button disabled={!!item.reviewClientDone} onClick={() => handleReviewClient(item.clientId, item.id)}>
                    Đánh giá khách hàng
                  </Button>
                </Group>
              )}

            {isClient &&
              (item.status === OrderStatus.COMPLETED || item.status === OrderStatus.CANCELED) &&
              item.canceler !== Role.CLIENT && (
                <Group>
                  <Button
                    disabled={!!item.reviewFreelancerDone}
                    onClick={() => handleReviewFreelancer(item.service.ownerId, item.id)}
                  >
                    Đánh giá freelancer
                  </Button>

                  <Button
                    onClick={() => handleReviewService(item.serviceId, item.id)}
                    disabled={!!item.reviewServiceDone}
                  >
                    Đánh giá dịch vụ
                  </Button>
                </Group>
              )}

            {(item.status === OrderStatus.DOING ||
              item.status === OrderStatus.COMPLETED ||
              item.status === OrderStatus.CANCELED) && (
              <ButtonContact otherPersonId={isFreelancer ? item.clientId : item.service.ownerId} />
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
          {serviceStatusTabs.map((tab) => (
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

      <ModalReviewService ref={reviewServiceRef} onSuccess={() => void refetch()} />
      <ModalReviewUser ref={reviewUserRef} onSuccess={() => void refetch()} type={TransactionOrderType.SERVICE} />
    </>
  );
};

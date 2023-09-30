import { Avatar, Group, LoadingOverlay, Modal, type ModalProps, Text, Title } from "@mantine/core";
import moment from "moment";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";

import { api } from "../../../utils/api";
import { formatName, formatPrice } from "../../../utils/formatter";
import { ApproveButton } from "./approve-button";

type Props = Omit<ModalProps, "onClose" | "opened">;

type Ref = {
  openModal: (jobId: string) => void;
  closeModal: () => void;
};

const _ModalBidList: ForwardRefRenderFunction<Ref, Props> = ({ ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const [jobId, setJobId] = useState("");
  const { data, isLoading } = api.bidJob.getBidListByJob.useQuery(
    { jobId },
    {
      enabled: !!jobId,
    },
  );

  useImperativeHandle(ref, () => ({
    openModal: (_jobId) => {
      setOpened(true);
      setJobId(_jobId);
    },
    closeModal: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    setJobId("");
  };

  return (
    <Modal opened={opened} onClose={handleClose} withCloseButton={false} {...props}>
      <LoadingOverlay visible={isLoading} />

      {jobId && (
        <>
          <Title order={4} mb="xl">
            Mã công việc: {jobId}
          </Title>

          <Text mb="md">Số lượng báo giá: {data?.length || 0}</Text>

          {data?.map(({ freelancer, price, createdAt }) => (
            <Group key={nanoid()} position="apart" mt="xs">
              <Group spacing="xs">
                <Link href={`/profile/freelancer/${freelancer.id}`} target="_blank" rel="noopener noreferrer">
                  <Avatar size="sm" radius="xl" src={freelancer.image}>
                    {formatName(freelancer.name)}
                  </Avatar>
                </Link>

                <Text>{formatPrice(price)}</Text>
              </Group>

              <Group>
                <Text fz="xs">{moment(createdAt).format("DD/MM/YYYY HH:mm")}</Text>

                <ApproveButton freelancerId={freelancer.id} jobId={jobId} price={price} />
              </Group>
            </Group>
          ))}
        </>
      )}
    </Modal>
  );
};

export const ModalBidList = forwardRef<Ref, Props>(_ModalBidList);

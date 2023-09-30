import { Avatar, Box, Divider, Group, LoadingOverlay, Modal, type ModalProps, Text, Title } from "@mantine/core";
import moment from "moment";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";

import { Gallery } from "../../../components";
import { api } from "../../../utils/api";
import { formatName } from "../../../utils/formatter";
import { ApproveButton } from "./approve-button";

type Props = Omit<ModalProps, "onClose" | "opened">;

type Ref = {
  openModal: (contestId: string) => void;
  closeModal: () => void;
};

const _ModalProductList: ForwardRefRenderFunction<Ref, Props> = ({ ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const [contestId, setContestId] = useState("");
  const { data, isLoading } = api.productContest.getProductListByContest.useQuery(
    { contestId },
    {
      enabled: !!contestId,
    },
  );

  useImperativeHandle(ref, () => ({
    openModal: (_contestId) => {
      setOpened(true);
      setContestId(_contestId);
    },
    closeModal: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    setContestId("");
  };

  return (
    <Modal opened={opened} onClose={handleClose} withCloseButton={false} {...props}>
      <LoadingOverlay visible={isLoading} />

      {contestId && (
        <>
          <Title order={4} mb="xl">
            Mã cuộc thi: {contestId}
          </Title>

          <Text mb="md">Số lượng sản phẩm đã nộp: {data?.length || 0}</Text>

          {data?.map(({ freelancer, createdAt, gallery, url }) => (
            <Box key={nanoid()}>
              <Divider my="md" />

              <Group position="apart" mb="md">
                <Link href={`/profile/freelancer/${freelancer.id}`} target="_blank" rel="noopener noreferrer">
                  <Group spacing="xs">
                    <Avatar size="sm" radius="xl" src={freelancer.image}>
                      {formatName(freelancer.name)}
                    </Avatar>

                    <Text>{freelancer.name}</Text>
                  </Group>
                </Link>

                <Group>
                  <Text fz="xs">{moment(createdAt).format("DD/MM/YYYY HH:mm")}</Text>

                  <ApproveButton
                    freelancerId={freelancer.id}
                    contestId={contestId}
                    gallery={gallery || ""}
                    url={url || ""}
                  />
                </Group>
              </Group>

              {url && (
                <Box mb="xs">
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </Link>
                </Box>
              )}

              {gallery && <Gallery gridSize="big" readOnly={true} initJsonValues={gallery} />}
            </Box>
          ))}
        </>
      )}
    </Modal>
  );
};

export const ModalProductList = forwardRef<Ref, Props>(_ModalProductList);

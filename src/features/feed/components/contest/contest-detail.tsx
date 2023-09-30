import { Avatar, Box, Group, Modal, type ModalProps, Text, Title, TypographyStylesProvider } from "@mantine/core";
import type { Category, Contest, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { type ForwardRefRenderFunction, forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";

import { api } from "../../../../utils/api";
import { formatName, formatPrice } from "../../../../utils/formatter";
import { FormSubmit } from "./form-submit";
import { TopSection } from "./top-section";

type PropsData = Contest & {
  owner: User;
  category: Category;
};

type Props = Omit<ModalProps, "onClose" | "opened"> & {
  onUnsaveSuccess?: (jobId: string) => void;
  onSaveSuccess?: () => Promise<void>;
};

type Ref = {
  openModal: (_contest: PropsData) => void;
  closeModal: () => void;
};

const _ContestDetail: ForwardRefRenderFunction<Ref, Props> = ({ onUnsaveSuccess, onSaveSuccess, ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const [contest, setContest] = useState<PropsData | undefined>();
  const { refetch } = api.productContest.getProductListByContest.useQuery(
    { contestId: contest?.id || "" },
    { enabled: false },
  );

  useImperativeHandle(ref, () => ({
    openModal: (_contest: PropsData) => {
      setOpened(true);
      setContest(_contest);
    },
    closeModal: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    setContest(undefined);
  };

  const handleSubmitSuccess = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <Modal
      {...props}
      opened={opened}
      onClose={handleClose}
      title={null}
      withCloseButton={false}
      padding="xl"
      size={500}
    >
      <TopSection
        categoryName={contest?.category.name || ""}
        contestId={contest?.id || ""}
        ownerId={contest?.ownerId || ""}
        onSaveSuccess={onSaveSuccess}
        onUnsaveSuccess={onUnsaveSuccess}
      />

      <Title order={3}>{contest?.name}</Title>

      <Group position="apart">
        <Link href={`/profile/client/${contest?.owner.id || ""}`} target="_blank" rel="noopener noreferrer">
          <Group spacing="xs" my="md">
            <Avatar size="md" radius="xl" src={contest?.owner.image}>
              {formatName(contest?.owner.name)}
            </Avatar>

            <Box>
              <Text size="sm" fw={600}>
                {contest?.owner.name}
              </Text>

              <Text size="xs">{moment(contest?.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
            </Box>
          </Group>
        </Link>

        <Text fw="bold">{formatPrice(contest?.budget)}</Text>
      </Group>

      <TypographyStylesProvider fz="sm">
        <div dangerouslySetInnerHTML={{ __html: contest?.info || "" }} />
      </TypographyStylesProvider>

      <FormSubmit contestId={contest?.id} onSuccess={handleSubmitSuccess} />
    </Modal>
  );
};

const __ContestDetail = forwardRef<Ref, Props>(_ContestDetail);

export const ContestDetail = memo(__ContestDetail);

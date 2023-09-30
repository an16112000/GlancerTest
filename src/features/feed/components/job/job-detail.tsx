import {
  Avatar,
  Box,
  Divider,
  Group,
  Modal,
  type ModalProps,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { Center, LoadingOverlay } from "@mantine/core";
import type { Category, Job, User } from "@prisma/client";
import moment from "moment";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  type ForwardRefRenderFunction,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { api } from "../../../../utils/api";
import { formatName, formatPrice } from "../../../../utils/formatter";
import { BidCard } from "./bid-card";
import { InputBid } from "./input-bid";
import { TopSection } from "./top-section";

type PropsData = Job & {
  owner: User;
  category: Category;
};

type Props = Omit<ModalProps, "onClose" | "opened"> & {
  onUnsaveSuccess?: (jobId: string) => void;
  onSaveSuccess?: () => Promise<void>;
};

type Ref = {
  openModal: (_job: PropsData) => void;
  closeModal: () => void;
};

const _JobDetail: ForwardRefRenderFunction<Ref, Props> = ({ onUnsaveSuccess, onSaveSuccess, ...props }, ref) => {
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);
  const [job, setJob] = useState<PropsData | undefined>();
  const { data: bidList, refetch } = api.bidJob.getBidListByJob.useQuery({ jobId: job?.id || "" }, { enabled: !!job });
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: (_job: PropsData) => {
      setOpened(true);
      setJob(_job);
    },
    closeModal: handleClose,
  }));

  const isOwner = useMemo(() => {
    return session?.user?.id === job?.ownerId;
  }, [job?.ownerId, session?.user?.id]);

  const handleClose = () => {
    setOpened(false);
    setJob(undefined);
    setIsLoading(false);
  };

  const handleReload = useCallback(async () => {
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
        categoryName={job?.category.name || ""}
        jobId={job?.id || ""}
        ownerId={job?.ownerId || ""}
        onSaveSuccess={onSaveSuccess}
        onUnsaveSuccess={onUnsaveSuccess}
      />

      <Title order={3}>{job?.name}</Title>

      <Group position="apart">
        <Link href={`/profile/client/${job?.owner.id || ""}`} target="_blank" rel="noopener noreferrer">
          <Group spacing="xs" my="md">
            <Avatar size="md" radius="xl" src={job?.owner.image}>
              {formatName(job?.owner.name)}
            </Avatar>

            <Box>
              <Text size="sm" fw={600}>
                {job?.owner.name}
              </Text>

              <Text size="xs">{moment(job?.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
            </Box>
          </Group>
        </Link>

        <Text fw="bold">{formatPrice(job?.budget)}</Text>
      </Group>

      <TypographyStylesProvider fz="sm">
        <div dangerouslySetInnerHTML={{ __html: job?.info || "" }} />
      </TypographyStylesProvider>

      {isOwner ? <Divider mb="lg" /> : <InputBid mb="xl" jobId={job?.id || ""} onSuccess={handleReload} />}

      {isLoading ? (
        <Box h={100} pos="relative">
          <LoadingOverlay visible={isLoading} />
        </Box>
      ) : !!bidList?.length ? (
        bidList?.map((item) => (
          <BidCard
            key={nanoid()}
            freelancer={item.freelancer}
            createdAt={item.createdAt}
            jobId={item.jobId}
            price={item.price}
            onSuccess={handleReload}
          />
        ))
      ) : (
        <Center fz="sm">Chưa có báo giá</Center>
      )}
    </Modal>
  );
};

const __JobDetail = forwardRef<Ref, Props>(_JobDetail);

export const JobDetail = memo(__JobDetail);

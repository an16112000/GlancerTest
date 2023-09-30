import { Carousel } from "@mantine/carousel";
import { AspectRatio, Badge, Box, Flex, Group, Modal, type ModalProps, Text, Title } from "@mantine/core";
import type { Portfolio } from "@prisma/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useMemo, useState } from "react";

type Props = Omit<ModalProps, "onClose" | "opened">;

type Ref = {
  openModal: (data: Portfolio) => void;
  closeModal: () => void;
};

const _ModalPortfolioDetail: ForwardRefRenderFunction<Ref, Props> = ({ ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const [data, setData] = useState<Portfolio | undefined>();

  useImperativeHandle(ref, () => ({
    openModal: (data) => {
      setOpened(true);
      setData(data);
    },
    closeModal: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    setData(undefined);
  };

  const gallery = useMemo(() => {
    if (data?.gallery) {
      const parsedGallery = JSON.parse(data.gallery) as string[];

      return parsedGallery;
    }

    return [];
  }, [data?.gallery]);

  const skills = useMemo(() => {
    if (data?.skills) {
      const parsedSkills = JSON.parse(data.skills) as string[];

      return parsedSkills;
    }

    return [];
  }, [data?.skills]);

  return (
    <Modal opened={opened} onClose={handleClose} size={600} withCloseButton={false} padding="xl" {...props}>
      <Title order={2}>{data?.title}</Title>

      {data?.projectUrl && (
        <Group pt="xl" spacing="xs">
          <Text>Link project:</Text>

          <Link href={data.projectUrl}>
            <Text variant="link">{data?.projectUrl}</Text>
          </Link>
        </Group>
      )}

      <Carousel my="xl">
        {gallery.map((item) => (
          <Carousel.Slide key={nanoid()}>
            <AspectRatio ratio={2}>
              <Image fill alt="" src={item} />
            </AspectRatio>
          </Carousel.Slide>
        ))}
      </Carousel>

      <Box pb="xl">
        <Title order={3} mb="xs">
          Mô tả
        </Title>

        <Text>{data?.description}</Text>
      </Box>

      <Box>
        <Title order={3} mb="xs">
          Công nghệ sử dụng
        </Title>

        <Flex wrap="wrap" gap="xs">
          {skills.map((item) => (
            <Badge key={nanoid()} size="lg">
              {item}
            </Badge>
          ))}
        </Flex>
      </Box>

      {data?.videoUrl && (
        <Box pt="xl">
          <Title order={3} mb="xs">
            Video
          </Title>

          <AspectRatio ratio={2} w="100%">
            <embed src={data.videoUrl} />
          </AspectRatio>
        </Box>
      )}
    </Modal>
  );
};

export const ModalPortfolioDetail = forwardRef<Ref, Props>(_ModalPortfolioDetail);

import { Carousel } from "@mantine/carousel";
import { AspectRatio, Grid, Group, Paper, type PaperProps, Text, Title } from "@mantine/core";
import type { Portfolio } from "@prisma/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import React, { useMemo } from "react";

import { useRefPortal } from "../../hooks";
import { ModalPortfolioDetail } from "./modal-portfolio-detail";

type Props = PaperProps & {
  portfolios: Portfolio[];
};

export const FreelancerPortfolioSection: React.FC<Props> = ({ portfolios, ...props }) => {
  const ref = useRefPortal<typeof ModalPortfolioDetail>();

  const handleClickView = (portfolio: Portfolio) => {
    ref.current?.openModal(portfolio);
  };

  return (
    <Paper withBorder p="md" {...props}>
      <Title order={3} mb="lg">
        Portfolio
      </Title>

      <Grid gutter="md">
        {portfolios.length < 4 ? (
          portfolios.map((portfolio) => (
            <Grid.Col span={4} key={nanoid()}>
              <PortfolioCard portfolio={portfolio} onClick={handleClickView} />
            </Grid.Col>
          ))
        ) : (
          <Carousel w="100%" align="start" withIndicators px="xs" mb="xs">
            {portfolios.map((portfolio) => (
              <Carousel.Slide key={nanoid()} size="33.3333%">
                <PortfolioCard portfolio={portfolio} onClick={handleClickView} />
              </Carousel.Slide>
            ))}
          </Carousel>
        )}
      </Grid>

      <ModalPortfolioDetail ref={ref} />
    </Paper>
  );
};

type PropsPortfolioCard = {
  portfolio: Portfolio;
  onClick?: (portfolio: Portfolio) => void;
};

const PortfolioCard: React.FC<PropsPortfolioCard> = ({ portfolio, onClick = () => undefined }) => {
  const banner = useMemo(() => {
    if (portfolio.gallery) {
      const parsedGallery = JSON.parse(portfolio.gallery) as string[];

      return parsedGallery[0] || "";
    }

    return "";
  }, [portfolio.gallery]);

  return (
    <Paper withBorder onClick={() => onClick(portfolio)} sx={{ cursor: "pointer" }}>
      <AspectRatio ratio={1.7}>
        <Image alt="" fill src={banner} />
      </AspectRatio>

      <Group position="apart" p="sm">
        <Text fw="bold">{portfolio.title}</Text>
      </Group>
    </Paper>
  );
};

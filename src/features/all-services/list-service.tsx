import { Grid, LoadingOverlay } from "@mantine/core";
import type { Category, FavoriteService, ReviewService, Service, User } from "@prisma/client";
import { nanoid } from "nanoid";
import { memo } from "react";

import { ServiceCard } from "../../components";

type Props = {
  dataSource:
    | (Service & {
        category: Category;
        favorites: FavoriteService[];
        owner: User;
        reviews: ReviewService[];
      })[]
    | undefined;
  isLoading: boolean;
};

const _ListService: React.FC<Props> = ({ dataSource, isLoading }) => {
  return (
    <Grid pos="relative" mih={200}>
      <LoadingOverlay visible={isLoading} />

      {dataSource?.map((service) => (
        <Grid.Col key={nanoid()} span={12} sm={3}>
          <ServiceCard {...service} />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export const ListService = memo(_ListService);

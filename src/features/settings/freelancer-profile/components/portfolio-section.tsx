import { Button, Grid, Group, Paper, type PaperProps, Text, Title } from "@mantine/core";
import type { FreelancerProfile, Portfolio } from "@prisma/client";
import { nanoid } from "nanoid";
import React, { memo, useState } from "react";

import { ListWrapper } from "../../../../components";
import { useRefPortal } from "../../../../hooks";
import { api } from "../../../../utils/api";
import { notiDelete } from "../../../../utils/notificator";
import { ConfigPortfolio } from "./config-portfolio";

type Props = PaperProps & {
  profile: FreelancerProfile;
};

const _PortfolioSection: React.FC<Props> = ({ profile, ...props }) => {
  const configRef = useRefPortal<typeof ConfigPortfolio>();
  const {
    data: portfolios,
    isLoading,
    refetch,
  } = api.portfolio.getAllByProfile.useQuery({ profileId: profile.id }, { refetchOnWindowFocus: false });
  const { mutateAsync: apiDelete } = api.portfolio.delete.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClickCreate = () => configRef.current?.openDrawer();

  const handleClickEdit = (portfolio: Portfolio) => configRef.current?.openDrawer(portfolio);

  const handleClickDelete = async (id: string) => {
    try {
      setIsDeleting(true);

      await apiDelete({ id });

      await refetch();

      notiDelete({ subject: "portfolio" });
    } catch (error) {
      console.log(error);

      notiDelete({ subject: "portfolio", isFailed: true });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessConfig = async () => {
    await refetch();
  };

  return (
    <>
      <Paper withBorder p="md" {...props}>
        <Group position="apart" mb="md">
          <Title order={4}>Portfolio</Title>

          <Group>
            <Button variant="light" onClick={handleClickCreate}>
              Thêm mới
            </Button>
          </Group>
        </Group>

        <ListWrapper isLoading={isLoading} isEmpty={!portfolios?.length}>
          <Grid>
            {portfolios?.map((portfolio) => (
              <Grid.Col key={nanoid()} span={4}>
                <Paper withBorder p="xs" h="100%">
                  <Text lineClamp={1} fw="bold">
                    {portfolio.title}
                  </Text>

                  <Group mt="xs" grow spacing="xs">
                    <Button variant="outline" onClick={() => handleClickEdit(portfolio)}>
                      Chỉnh sửa
                    </Button>

                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => void handleClickDelete(portfolio.id)}
                      loading={isDeleting}
                    >
                      Gỡ bỏ
                    </Button>
                  </Group>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </ListWrapper>
      </Paper>

      <ConfigPortfolio ref={configRef} onSuccess={handleSuccessConfig} profile={profile} />
    </>
  );
};

export const PortfolioSection = memo(_PortfolioSection);

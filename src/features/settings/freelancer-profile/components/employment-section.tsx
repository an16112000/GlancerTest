import { Button, Grid, Group, Paper, type PaperProps, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { Employment, FreelancerProfile } from "@prisma/client";
import { nanoid } from "nanoid";
import React, { memo, useState } from "react";

import { ListWrapper } from "../../../../components";
import { useRefPortal } from "../../../../hooks";
import { api } from "../../../../utils/api";
import { ConfigEmployment } from "./config-employment";

type Props = PaperProps & {
  profile: FreelancerProfile;
};

const _EmploymentSection: React.FC<Props> = ({ profile, ...props }) => {
  const configRef = useRefPortal<typeof ConfigEmployment>();
  const {
    data: employments,
    isLoading,
    refetch,
  } = api.employment.getAllByProfile.useQuery({ profileId: profile.id }, { refetchOnWindowFocus: false });
  const { mutateAsync: apiDelete } = api.employment.delete.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClickCreate = () => configRef.current?.openDrawer();

  const handleClickEdit = (employment: Employment) => configRef.current?.openDrawer(employment);

  const handleClickDelete = async (id: string) => {
    try {
      setIsDeleting(true);

      await apiDelete({ id });

      await refetch();

      showNotification({
        color: "green",
        message: "Xóa kinh nghiệm làm việc thành công!",
      });
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Xóa kinh nghiệm làm việc thất bại!",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessConfig = async () => {
    await refetch();
  };

  return (
    <Paper withBorder p="md" {...props}>
      <Group position="apart" mb="md">
        <Title order={4}>Kinh nghiệm làm việc</Title>

        <Group>
          <Button variant="light" onClick={handleClickCreate}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <ListWrapper isLoading={isLoading} isEmpty={!employments?.length}>
        <Grid>
          {employments?.map((employment) => (
            <Grid.Col key={nanoid()} span={4}>
              <Paper withBorder p="xs" h="100%">
                <Text lineClamp={1} fw="bold">
                  {employment.company}
                </Text>

                <Text fz="xs">
                  {employment.from} - {employment.to ? employment.to : "hiện tại"}
                </Text>

                <Text fz="sm">{employment.title}</Text>

                <Group mt="xs" grow spacing="xs">
                  <Button variant="outline" onClick={() => handleClickEdit(employment)}>
                    Chỉnh sửa
                  </Button>

                  <Button
                    variant="outline"
                    color="red"
                    onClick={() => void handleClickDelete(employment.id)}
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

      <ConfigEmployment ref={configRef} onSuccess={handleSuccessConfig} profile={profile} />
    </Paper>
  );
};

export const EmploymentSection = memo(_EmploymentSection);

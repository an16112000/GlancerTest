import { Button, Grid, Group, Paper, type PaperProps, Text, Title } from "@mantine/core";
import type { Education, FreelancerProfile } from "@prisma/client";
import { nanoid } from "nanoid";
import React, { memo, useState } from "react";

import { ListWrapper } from "../../../../components";
import { useRefPortal } from "../../../../hooks";
import { api } from "../../../../utils/api";
import { notiDelete } from "../../../../utils/notificator";
import { ConfigEducation } from "./config-education";

type Props = PaperProps & {
  profile: FreelancerProfile;
};

const _EducationSection: React.FC<Props> = ({ profile, ...props }) => {
  const configRef = useRefPortal<typeof ConfigEducation>();

  const {
    data: educations,
    isLoading,
    refetch,
  } = api.education.getAllByProfile.useQuery({ profileId: profile.id }, { refetchOnWindowFocus: false });
  const { mutateAsync: apiDelete } = api.education.delete.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClickCreate = () => configRef.current?.openDrawer();

  const handleClickEdit = (education: Education) => configRef.current?.openDrawer(education);

  const handleClickDelete = async (id: string) => {
    try {
      setIsDeleting(true);

      await apiDelete({ id });

      await refetch();

      notiDelete({ subject: "học vấn" });
    } catch (error) {
      console.log(error);

      notiDelete({ subject: "học vấn", isFailed: true });
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
          <Title order={4}>Học vấn</Title>

          <Group>
            <Button variant="light" onClick={handleClickCreate}>
              Thêm mới
            </Button>
          </Group>
        </Group>

        <ListWrapper isLoading={isLoading} isEmpty={!educations?.length}>
          <Grid>
            {educations?.map((education) => (
              <Grid.Col key={nanoid()} span={4}>
                <Paper withBorder p="xs" h="100%">
                  <Text lineClamp={1} fw="bold">
                    {education.school}
                  </Text>

                  {education.from ? (
                    <Text fz="xs">
                      {education.from} - {education.to ? education.to : "hiện tại"}
                    </Text>
                  ) : (
                    <Text fz="xs">Đang học</Text>
                  )}

                  {education.area && <Text fz="sm">{education.area}</Text>}

                  <Group mt="xs" grow spacing="xs">
                    <Button variant="outline" onClick={() => handleClickEdit(education)}>
                      Chỉnh sửa
                    </Button>

                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => void handleClickDelete(education.id)}
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

      <ConfigEducation ref={configRef} onSuccess={handleSuccessConfig} profile={profile} />
    </>
  );
};

export const EducationSection = memo(_EducationSection);

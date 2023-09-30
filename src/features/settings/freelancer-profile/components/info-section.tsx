import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  type PaperProps,
  Switch,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { cleanNotifications, showNotification, updateNotification } from "@mantine/notifications";
import type { FreelancerProfile } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { memo, useEffect, useState } from "react";
import { z } from "zod";

import { SelectCategory } from "../../../../components";
import { api } from "../../../../utils/api";
import { SkillsInput } from "./skills-input";

const NOTI_DELETE_ID = "DELETE";

type PropsForm = {
  categoryId: string;
  title: string;
  description: string;
};

const formSchema = z.object({
  title: z.string().min(1, { message: "Vui lòng điền tiêu đề" }),
  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
  description: z.string().min(1, { message: "Vui lòng điền mô tả" }),
});

type Props = PaperProps & {
  profile: FreelancerProfile;
  onReloadProfile: () => Promise<void>;
};

const _InfoSection: React.FC<Props> = ({ profile, onReloadProfile, ...props }) => {
  const { data: session } = useSession();
  const { mutateAsync: apiUpdate, isLoading: isLoadingUpdate } = api.freelancerProfile.update.useMutation();
  const { mutateAsync: apiDelete } = api.freelancerProfile.delete.useMutation();
  const [skills, setSkills] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const form = useForm<PropsForm>({
    initialValues: {
      categoryId: "",
      title: "",
      description: "",
    },
    validate: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setFieldValue("categoryId", profile.categoryId);
    form.setFieldValue("description", profile.description);
    form.setFieldValue("title", profile.title);
    setActive(profile.active);
    setSkills(JSON.parse(profile.skills || "") as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.categoryId]);

  const handleUpdate = async (values: PropsForm) => {
    try {
      const data = {
        ...values,
        active,
        skills: JSON.stringify(skills),
        id: profile.id,
        freelancerId: session?.user?.id || "",
      };

      await apiUpdate(data);

      showNotification({
        color: "green",
        message: "Cập nhật thông tin cơ bản thành công!",
      });

      if (values.title.trim() !== profile.title.trim()) {
        await onReloadProfile();
      }
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Cập nhật thông tin cơ bản thất bại!",
      });
    }
  };

  const handleDelete = async () => {
    cleanNotifications();

    try {
      showNotification({
        id: NOTI_DELETE_ID,
        color: "orange",
        message: `Đang xóa hồ sơ ${profile.title}`,
        loading: true,
        autoClose: false,
        disallowClose: true,
      });

      setIsLoadingDelete(true);

      await apiDelete({ id: profile.id });

      await onReloadProfile();

      updateNotification({
        id: NOTI_DELETE_ID,
        color: "green",
        message: "Xóa hồ sơ thành công!",
      });
    } catch (error) {
      console.log(error);

      updateNotification({
        id: NOTI_DELETE_ID,
        color: "red",
        message: "Xóa hồ sơ thất bại!",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoadingDelete} />

      <Group mb="md">
        <Button color="red" onClick={() => void handleDelete()}>
          Xóa hồ sơ
        </Button>
      </Group>

      <Paper withBorder p="md" {...props}>
        <form onSubmit={form.onSubmit((values) => void handleUpdate(values))}>
          <Group position="apart" mb="md">
            <Title order={4}>Thông tin cơ bản</Title>

            <Group>
              <Switch label="Công khai" checked={active} onChange={(e) => setActive(e.target.checked)} />

              <Button type="submit" loading={isLoadingUpdate} variant="light">
                Cập nhật
              </Button>
            </Group>
          </Group>

          <Grid mb="xs">
            <Grid.Col span={6}>
              <TextInput label="Tiêu đề" {...form.getInputProps("title")} />
            </Grid.Col>

            <Grid.Col span={6}>
              <SelectCategory {...form.getInputProps("categoryId")} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Textarea label="Mô tả" {...form.getInputProps("description")} />
            </Grid.Col>

            <Grid.Col span={12}>
              <SkillsInput skills={skills} setSkills={setSkills} />
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export const InfoSection = memo(_InfoSection);

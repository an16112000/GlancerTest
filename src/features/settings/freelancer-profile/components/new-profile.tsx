import { Button, Drawer, type DrawerProps, Grid, TextInput, Textarea, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import React, { type ForwardRefRenderFunction, forwardRef, memo, useImperativeHandle, useState } from "react";
import { z } from "zod";

import { SelectCategory } from "../../../../components";
import { api } from "../../../../utils/api";
import { SkillsInput } from "./skills-input";

type Props = Omit<DrawerProps, "onClose" | "opened"> & {
  onSuccess: () => Promise<void>;
};

type Ref = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

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

const _NewProfile: ForwardRefRenderFunction<Ref, Props> = ({ onSuccess, ...props }, ref) => {
  const { data: session } = useSession();
  const { mutateAsync: apiCreate } = api.freelancerProfile.create.useMutation();
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const form = useForm<PropsForm>({
    initialValues: {
      categoryId: "",
      title: "",
      description: "",
    },
    validate: zodResolver(formSchema),
  });

  useImperativeHandle(ref, () => ({
    openDrawer: () => {
      setOpened(true);
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    form.reset();
    setIsLoading(false);
    setSkills([]);
  };

  const handleSubmit = async (values: PropsForm) => {
    try {
      setIsLoading(true);

      const data = {
        ...values,
        freelancerId: session?.user?.id || "",
        skills: JSON.stringify(skills),
      };

      await apiCreate(data);

      await onSuccess();

      showNotification({
        color: "green",
        message: "Tạo mới hồ sơ thành công!",
      });

      handleClose();
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Tạo mới hồ sơ thất bại!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={handleClose}
      title={<Title order={2}>Thêm mới hồ sơ</Title>}
      padding="xl"
      size={500}
    >
      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <Grid mb="sm">
          <Grid.Col span={12}>
            <TextInput label="Tiêu đề" {...form.getInputProps("title")} />
          </Grid.Col>

          <Grid.Col span={12}>
            <SelectCategory {...form.getInputProps("categoryId")} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea label="Mô tả" {...form.getInputProps("description")} />
          </Grid.Col>

          <Grid.Col span={12}>
            <SkillsInput skills={skills} setSkills={setSkills} />
          </Grid.Col>
        </Grid>

        <Button type="submit" loading={isLoading}>
          Thêm mới
        </Button>
      </form>
    </Drawer>
  );
};

const __NewProfile = forwardRef<Ref, Props>(_NewProfile);

export const NewProfile = memo(__NewProfile);

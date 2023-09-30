import { Button, Drawer, type DrawerProps, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { Job } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";

import { InputInteger, InputPrice, SelectCategory, TextEditor } from "../../components";
import { useRefTinyMCE } from "../../hooks";
import { api } from "../../utils/api";

type Props = Omit<DrawerProps, "onClose" | "opened"> & {
  onSuccess: () => Promise<void>;
};
type Ref = {
  openDrawer: (data?: Job) => void;
  closeDrawer: () => void;
};
type PropsForm = Omit<Job, "id" | "ownerId" | "createdAt" | "updatedAt" | "info" | "archived">;

const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng điền tên dịch vụ" }),
  budget: z.number({ required_error: "Vui lòng điền giá dịch vụ" }),
  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
  dayLength: z
    .number({ required_error: "Vui lòng điền thời hạn dự án" })
    .min(1, { message: "Thời hạn dự án tối thiểu là 1 ngày" }),
});

const _ConfigJob: ForwardRefRenderFunction<Ref, Props> = ({ onSuccess, ...props }, ref) => {
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);
  const [initData, setInitData] = useState<Job | undefined>();
  const editorRef = useRefTinyMCE();
  const { mutateAsync: apiCreate, isLoading: loadingCreate } = api.job.create.useMutation();
  const { mutateAsync: apiUpdate, isLoading: loadingUpdate } = api.job.update.useMutation();

  const form = useForm<PropsForm>({
    initialValues: {
      name: "",
      budget: 0,
      categoryId: "",
      dayLength: 1,
    },
    validate: zodResolver(formSchema),
  });

  useImperativeHandle(ref, () => ({
    openDrawer: (data) => {
      setOpened(true);

      if (data) {
        setInitData(data);

        form.setFieldValue("name", data.name);
        form.setFieldValue("categoryId", data.categoryId);
        form.setFieldValue("budget", data.budget);
        form.setFieldValue("dayLength", data.dayLength);
      }
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    form.reset();
    setInitData(undefined);
  };

  const handleSubmit = async (values: PropsForm) => {
    const info = editorRef.current?.getContent() || "";

    const data = {
      ...values,
      info,
      ownerId: session?.user?.id || "",
    };

    console.log(data);

    try {
      if (!initData) await apiCreate(data);
      else await apiUpdate({ ...data, id: initData.id });

      showNotification({
        color: "green",
        message: `${!initData ? "Thêm mới" : "Chỉnh sửa"} thành công!`,
      });

      await onSuccess();

      handleClose();
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: `${!initData ? "Thêm mới" : "Chỉnh sửa"} thất bại!`,
      });
    }
  };

  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={handleClose}
      title={<Title order={2}>{!initData ? "Thêm mới" : "Chỉnh sửa"} công việc</Title>}
      padding="xl"
      size={1000}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />

      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <TextInput label="Tên công việc" {...form.getInputProps("name")} mb="sm" />

        <Group align="start" grow mb="sm">
          <SelectCategory {...form.getInputProps("categoryId")} clearable={false} />

          <InputPrice label="Mức chi" {...form.getInputProps("budget")} />

          <InputInteger label="Thời hạn" {...form.getInputProps("dayLength")} />
        </Group>

        <TextEditor editorRef={editorRef} label="Thông tin" initData={initData?.info} />

        <Group position="right">
          <Button mt="xl" type="submit">
            Cập nhật
          </Button>
        </Group>
      </form>
    </Drawer>
  );
};

export const ConfigJob = forwardRef<Ref, Props>(_ConfigJob);

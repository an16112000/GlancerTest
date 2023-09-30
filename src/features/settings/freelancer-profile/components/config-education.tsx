import { Button, Checkbox, Drawer, type DrawerProps, Grid, TextInput, Textarea, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import type { Education, FreelancerProfile } from "@prisma/client";
import React, { type ForwardRefRenderFunction, forwardRef, memo, useImperativeHandle, useState } from "react";

import { SelectDegree } from "../../../../components";
import { useConfigEducation } from "../hooks";

type Props = Omit<DrawerProps, "onClose" | "opened"> & {
  profile: FreelancerProfile;
  onSuccess: () => Promise<void>;
};

type Ref = {
  openDrawer: (data?: Education) => void;
  closeDrawer: () => void;
};

const _ConfigEducation: ForwardRefRenderFunction<Ref, Props> = ({ profile, onSuccess, ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const {
    form,
    initForm,
    resetData,
    onSubmit,
    configText,
    isLoading,
    isLearning,
    rerenderDatePickerTo,
    onCheckLearningStatus,
  } = useConfigEducation({ profile, onSuccess, onCloseDrawer: () => setOpened(false) });

  useImperativeHandle(ref, () => ({
    openDrawer: (data) => {
      setOpened(true);
      initForm(data);
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    resetData();
  };

  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={handleClose}
      title={<Title order={2}>{configText} học vấn</Title>}
      padding="xl"
      size={500}
    >
      <form onSubmit={onSubmit}>
        <Grid mb="sm" align="center">
          <Grid.Col span={12}>
            <TextInput label="Tên trường" {...form.getInputProps("school")} withAsterisk />
          </Grid.Col>

          <Grid.Col span={12}>
            <DatePicker {...form.getInputProps("from")} label="Từ ngày" />
          </Grid.Col>

          <Grid.Col span={3}>
            <Checkbox checked={isLearning} onChange={onCheckLearningStatus} label="Đang học" mt="xl" />
          </Grid.Col>

          <Grid.Col span={9}>
            {!rerenderDatePickerTo && (
              <DatePicker {...form.getInputProps("to")} label="Đến ngày" disabled={isLearning} />
            )}
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput label="Chuyên ngành" {...form.getInputProps("area")} />
          </Grid.Col>

          <Grid.Col span={12}>
            <SelectDegree {...form.getInputProps("degreeId")} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea label="Mô tả" {...form.getInputProps("description")} />
          </Grid.Col>
        </Grid>

        <Button type="submit" loading={isLoading}>
          {configText}
        </Button>
      </form>
    </Drawer>
  );
};

const __ConfigEducation = forwardRef<Ref, Props>(_ConfigEducation);

export const ConfigEducation = memo(__ConfigEducation);

import { Button, Drawer, type DrawerProps, Grid, Paper, Text, TextInput, Textarea, Title } from "@mantine/core";
import type { FreelancerProfile, Portfolio } from "@prisma/client";
import React, { type ForwardRefRenderFunction, forwardRef, memo, useImperativeHandle, useState } from "react";

import { Gallery } from "../../../../components";
import { useConfigPortfolio } from "../hooks";
import { SkillsInput } from "./skills-input";

type Props = Omit<DrawerProps, "onClose" | "opened"> & {
  profile: FreelancerProfile;
  onSuccess: () => Promise<void>;
};

type Ref = {
  openDrawer: (data?: Portfolio) => void;
  closeDrawer: () => void;
};

const _ConfigPortfolio: ForwardRefRenderFunction<Ref, Props> = ({ profile, onSuccess, ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const { form, isLoading, onSubmit, initForm, resetData, configText, skills, setSkills, galleryRef, initData } =
    useConfigPortfolio({
      profile,
      onSuccess,
      onCloseDrawer: () => setOpened(false),
    });

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
      title={<Title order={2}>{configText} portfolio</Title>}
      padding="xl"
      size={800}
    >
      <form onSubmit={onSubmit}>
        <Grid mb="sm" align="center">
          <Grid.Col span={12}>
            <TextInput label="Tiêu đề" {...form.getInputProps("title")} withAsterisk />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea label="Mô tả" withAsterisk {...form.getInputProps("description")} />
          </Grid.Col>

          <Grid.Col span={12}>
            <SkillsInput skills={skills} setSkills={setSkills} />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Video (Link youtube)"
              {...form.getInputProps("videoUrl")}
              placeholder="https://www.youtube.com/embed/..."
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Link project"
              {...form.getInputProps("projectUrl")}
              placeholder="https://www.example.com/"
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Text fw={600} fz="0.9rem" mb={5}>
              Ảnh mẫu
            </Text>

            <Paper withBorder p="sm">
              <Gallery ref={galleryRef} gridSize="big" initJsonValues={initData?.gallery} />
            </Paper>
          </Grid.Col>
        </Grid>

        <Button type="submit" loading={isLoading}>
          {configText}
        </Button>
      </form>
    </Drawer>
  );
};

const __ConfigPortfolio = forwardRef<Ref, Props>(_ConfigPortfolio);

export const ConfigPortfolio = memo(__ConfigPortfolio);

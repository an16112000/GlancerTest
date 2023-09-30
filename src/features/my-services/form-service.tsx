import { Button, Flex, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Service } from "@prisma/client";
import React, { useEffect } from "react";
import { z } from "zod";

import { FormLabel, Gallery, InputPrice, SelectCategory, TextEditor } from "../../components";
import { useRefPortal, useRefTinyMCE } from "../../hooks";
import { Banner, Wrapper } from "./components";
import { useFormService } from "./hooks";
import { isDataValid } from "./utils";

type PropsFormService = Omit<
  Service,
  "id" | "ownerId" | "createdAt" | "updatedAt" | "info" | "banner" | "gallery" | "archived"
>;

const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng điền tên dịch vụ" }),
  price: z.number({ required_error: "Vui lòng điền giá dịch vụ" }),
  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
});

type Props = {
  serviceData?: Service | null;
  isEdit?: boolean;
};

export const FormService: React.FC<Props> = ({ serviceData, isEdit = false }) => {
  const bannerRef = useRefPortal<typeof Banner>();
  const galleryRef = useRefPortal<typeof Gallery>();
  const editorRef = useRefTinyMCE();
  const { loadingSubmit, createService, editService } = useFormService();

  const form = useForm<PropsFormService>({
    initialValues: {
      name: "",
      price: 0,
      categoryId: "",
    },
    validate: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!!serviceData) {
      const { banner, categoryId, gallery, name, price } = serviceData;

      form.setValues({ categoryId, name, price });

      bannerRef.current?.setBanner(banner);

      galleryRef.current?.setGallery(JSON.parse(gallery) as string[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceData]);

  const handleSubmit = (values: PropsFormService) => {
    const info = editorRef.current?.getContent() || "";
    const bannerImage = bannerRef.current?.banner || "";
    const bannerFile = bannerRef.current?.file;
    const galleryImages: string[] = galleryRef.current?.gallery || [];
    const galleryFiles: File[] = galleryRef.current?.files || [];

    const isValid = isDataValid(info, bannerImage, galleryImages);

    if (!isValid) return console.log("invalid info");

    if (!isEdit) {
      if (!bannerFile) return console.log("Please upload banner");

      const data = {
        ...values,
        info,
        banner: "",
        gallery: "",
        bannerFile,
        galleryFiles,
      };

      void createService(data);
    } else {
      if (!serviceData?.id) return console.log("Service id not found");

      const data = {
        ...values,
        id: serviceData.id,
        info,
        banner: bannerImage,
        gallery: galleryImages,
        bannerFile,
        galleryFiles,
      };

      void editService(data, serviceData);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loadingSubmit} />

      <Group position="apart" mb="md">
        <Title order={2}>{isEdit ? "Chỉnh sửa" : "Thêm mới"} dịch vụ</Title>

        <Button type="submit">{!isEdit ? `Thêm mới` : "Cập nhật"}</Button>
      </Group>

      <Flex gap="md">
        <Flex direction="column" gap="md" sx={{ flex: 1 }}>
          <TextInput label="Tên dịch vụ" {...form.getInputProps("name")} />

          <TextEditor editorRef={editorRef} label="Thông tin" initData={serviceData?.info} />

          <Wrapper>
            <FormLabel>Ảnh mẫu</FormLabel>

            <Gallery ref={galleryRef} />
          </Wrapper>
        </Flex>

        <Flex direction="column" gap="md" w={250}>
          <Wrapper>
            <SelectCategory {...form.getInputProps("categoryId")} clearable={false} />

            <InputPrice label="Giá dịch vụ" mt="sm" {...form.getInputProps("price")} />
          </Wrapper>

          <Wrapper>
            <Banner ref={bannerRef} />
          </Wrapper>
        </Flex>
      </Flex>
    </form>
  );
};

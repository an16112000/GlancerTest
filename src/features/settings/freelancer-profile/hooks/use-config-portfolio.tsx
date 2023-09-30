import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { Portfolio } from "@prisma/client";
import { useState } from "react";
import { z } from "zod";

import type { Gallery } from "../../../../components";
import { uploadFile } from "../../../../helpers";
import { useRefPortal } from "../../../../hooks";
import { api } from "../../../../utils/api";
import { genTextCreateOrUpdate } from "../../../../utils/generator";
import { notiConfig } from "../../../../utils/notificator";
import type { PropsConfig } from "../types";

type PropsForm = {
  title: string;
  videoUrl?: string;
  projectUrl?: string;
  description: string;
};

const formSchema = z.object({
  title: z.string().min(1, { message: "Vui lòng điền tiêu đề" }),
  description: z.string().min(1, { message: "Vui lòng điền mô tả" }),
});

export const useConfigPortfolio = ({ profile, onSuccess, onCloseDrawer = () => undefined }: PropsConfig) => {
  const { mutateAsync: apiCreate } = api.portfolio.create.useMutation();
  const { mutateAsync: apiUpdate } = api.portfolio.update.useMutation();

  const galleryRef = useRefPortal<typeof Gallery>();
  const [isLoading, setIsLoading] = useState(false);
  const [initData, setInitData] = useState<Portfolio | undefined>();
  const [skills, setSkills] = useState<string[]>([]);

  const configText = genTextCreateOrUpdate(!!initData);

  const form = useForm<PropsForm>({
    initialValues: {
      title: "",
      videoUrl: "",
      projectUrl: "",
      description: "",
    },
    validate: zodResolver(formSchema),
  });

  const initForm = (data?: Portfolio) => {
    setInitData(data);

    if (data) {
      form.setFieldValue("title", data.title);
      form.setFieldValue("videoUrl", data.videoUrl || "");
      form.setFieldValue("projectUrl", data.projectUrl || "");
      form.setFieldValue("description", data.description);

      initSkills(data.skills);
    }
  };

  const initSkills = (jsonSkills: string | null) => {
    if (jsonSkills) {
      const parsedSkills = JSON.parse(jsonSkills) as string[];

      setSkills(parsedSkills);
    }
  };

  const handleSubmit = async (values: PropsForm) => {
    try {
      const galleryImages: string[] = galleryRef.current?.gallery || [];
      const galleryFiles: File[] = galleryRef.current?.files || [];

      if (galleryImages.length < 3) {
        return showNotification({
          color: "red",
          message: "Tải lên tối thiểu 3 ảnh mẫu",
        });
      }

      setIsLoading(true);

      const jsonGallery = await uploadGallery(galleryImages, galleryFiles);

      const jsonSkills = JSON.stringify(skills);

      const data = {
        ...values,
        skills: jsonSkills,
        profileId: profile.id,
        gallery: jsonGallery,
      };

      if (initData) {
        await apiUpdate({ ...data, id: initData.id });
      } else {
        await apiCreate(data);
      }

      await onSuccess();

      notiConfig({ isUpdate: !!initData, subject: "portfolio" });

      onCloseDrawer();
    } catch (error) {
      console.log(error);

      notiConfig({ isUpdate: !!initData, isFailed: true, subject: "portfolio" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    form.reset();
    setIsLoading(false);
    setInitData(undefined);
    galleryRef.current?.setGallery([]);
    galleryRef.current?.setFiles([]);
    onCloseDrawer();
  };

  const onSubmit = form.onSubmit((values) => void handleSubmit(values));

  return { form, onSubmit, initForm, isLoading, resetData, configText, skills, setSkills, galleryRef, initData };
};

const uploadGallery = async (images: string[], files: File[]) => {
  if (files.length) {
    console.log("Uploading gallery...");

    const imageUrls = images.filter((image) => !image.includes("data:image/"));

    const uploadedGallery = await Promise.all(files.map((file) => uploadFile(file)));

    if (uploadedGallery.some((image) => !image)) {
      throw Error("Uploaded gallery is maybe undefined");
    }

    console.log("Uploading gallery success", uploadedGallery);

    return JSON.stringify([...imageUrls, ...uploadedGallery]);
  }

  return JSON.stringify(images);
};

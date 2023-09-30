import { showNotification } from "@mantine/notifications";
import type { Service } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { uploadFile } from "../../helpers";
import { api } from "../../utils/api";

type PropsCreateService = Omit<Service, "id" | "createdAt" | "updatedAt" | "ownerId" | "archived"> & {
  bannerFile: File;
  galleryFiles: File[];
};

type PropsEditService = Omit<Service, "createdAt" | "updatedAt" | "ownerId" | "gallery" | "archived"> & {
  gallery: string | string[];
  bannerFile: File | null | undefined;
  galleryFiles?: File[];
};

export const useFormService = () => {
  const { mutateAsync: apiCreate } = api.service.create.useMutation();
  const { mutateAsync: apiUpdate } = api.service.update.useMutation();
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const createService = async (props: PropsCreateService) => {
    try {
      const data = { ...props, ownerId: session?.user?.id || "" };

      setLoadingSubmit(true);

      console.log("Uploading banner...");

      const uploadedBanner = await uploadFile(props.bannerFile);

      if (!uploadedBanner) throw Error("Uploaded banner is undefined");

      console.log("Uploading banner success", uploadedBanner);

      console.log("Uploading gallery...");

      const uploadedGallery = await Promise.all(props.galleryFiles.map((file) => uploadFile(file)));

      if (uploadedGallery.some((image) => !image)) throw Error("Uploaded gallery is maybe undefined");

      console.log("Uploading gallery success", uploadedGallery);

      data.banner = uploadedBanner;
      data.gallery = JSON.stringify(uploadedGallery);

      console.log("Inserting to DB...");

      await apiCreate(data);

      showNotification({
        color: "green",
        message: "Thêm mới dịch vụ thành công",
      });

      await router.push("/freelancer/my-services");
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Thêm mới dịch vụ thất bại",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const editService = async (props: PropsEditService, initData: Service) => {
    try {
      const data = { ...props, ownerId: session?.user?.id || "" };

      console.log(data, initData);

      setLoadingSubmit(true);

      if (props.banner !== initData.banner && props.bannerFile) {
        const uploadedBanner = await uploadFile(props.bannerFile);

        if (!uploadedBanner) {
          throw Error("Uploaded banner is undefined");
        }

        console.log("Uploading banner success", uploadedBanner);

        data.banner = uploadedBanner;
      }

      if (props.galleryFiles?.length) {
        console.log("Uploading gallery...");

        const imageUrls = [...data.gallery].filter((image) => !image.includes("data:image/"));

        const uploadedGallery = await Promise.all(props.galleryFiles.map((file) => uploadFile(file)));

        if (uploadedGallery.some((image) => !image)) {
          throw Error("Uploaded gallery is maybe undefined");
        }

        console.log("Uploading gallery success", uploadedGallery);

        data.gallery = JSON.stringify([...imageUrls, ...uploadedGallery]);
      } else {
        data.gallery = JSON.stringify(data.gallery);
      }

      console.log("Updating DB...");

      await apiUpdate({ ...data, gallery: data.gallery });

      showNotification({
        color: "green",
        message: "Chỉnh sửa dịch vụ thành công",
      });

      await router.push("/freelancer/my-services");
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Chỉnh sửa dịch vụ thất bại",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return { loadingSubmit, createService, editService };
};

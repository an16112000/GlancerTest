import { showNotification } from "@mantine/notifications";
import { keys } from "../../constants";

export const isDataValid = (
  info: string | undefined,
  bannerImage: string | null | undefined,
  galleryImages: string[] | undefined
) => {
  let isValid = true;

  if (!info || !info.trim()) {
    isValid = false;

    showNotification({
      color: "red",
      message: "Vui lòng cập nhật thông tin dịch vụ",
    });
  }

  if (!bannerImage) {
    isValid = false;

    showNotification({
      color: "red",
      message: "Vui lòng cập nhật ảnh bìa dịch vụ",
    });
  }

  if (!galleryImages || galleryImages.length < keys.MIN_GALLERY_UPLOAD) {
    isValid = false;

    showNotification({
      color: "red",
      message: `Vui lòng tải lên ít nhất ${keys.MIN_GALLERY_UPLOAD} ảnh mẫu dịch vụ`,
    });
  }

  return isValid;
};

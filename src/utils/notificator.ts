import { showNotification, updateNotification } from "@mantine/notifications";
import { nanoid } from "nanoid";

import { genTextCreateOrUpdate } from "./generator";

interface IConfig {
  isUpdate?: boolean;
  isFailed?: boolean;
  subject?: string;
  id?: string;
  text?: string;
}

/**
 * Thông báo [Đang thực hiện]...
 * @property {string} text - Thông báo thay thế thông báo mặc định
 * @returns {string} id thông báo
 */
export const notiLoading = ({ text }: IConfig): string => {
  let message = "Đang thực hiện...";

  if (text) {
    message = `${text}...`;
  }

  const id = nanoid();

  showNotification({
    id,
    color: "orange",
    message,
    disallowClose: true,
    autoClose: false,
    loading: true,
  });

  return id;
};

/**
 * Thông báo "[Thao tác] <thành công | thất bại>!"
 * @property {string} id
 * @property {bool} isFailed
 * @property {string} text - Từ khóa thay thế cho từ THAO TÁC
 */
export const notiAction = ({ isFailed, id, text }: IConfig) => {
  let color = "green";
  let message = "Thao tác";

  if (text) {
    message = text;
  }

  if (isFailed) {
    color = "red";
    message += " " + "thất bại!";
  } else {
    message += " " + "thành công!";
  }

  const data = { color, message };

  if (id) {
    updateNotification({ ...data, id });
  } else {
    showNotification(data);
  }
};

/**
 * Thông báo "<Thêm mới | Cập nhật> [...] <thành công | thất bại>!"
 * @property {string} id
 * @property {boolean} isUpdate
 * @property {boolean} isFailed
 * @property {string} subject - Từ khóa hậu tố của THÊM MỚI/CẬP NHẬT
 */
export const notiConfig = ({ isUpdate, isFailed, subject, id }: IConfig) => {
  let text = genTextCreateOrUpdate(isUpdate);

  if (subject) {
    text += " " + subject;
  }

  notiAction({
    isFailed,
    id,
    text,
  });
};

/**
 * Thông báo "Xóa [...] <thành công | thất bại>!"
 * @property {string} id
 * @property {boolean} isFailed
 * @property {string} subject - Từ khóa hậu tố của XOÁ
 */
export const notiDelete = ({ isFailed, subject, id }: IConfig) => {
  let text = "Xóa";

  if (subject) {
    text += " " + subject;
  }

  notiAction({
    isFailed,
    id,
    text,
  });
};

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";

import { storage } from "./libs/firebase";

export const uploadFile = async (file: File) => {
  try {
    const fileRef = ref(storage, `${nanoid(20)}-${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.log(error);
  }
};

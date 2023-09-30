import { useRef } from "react";
import { type Editor as TinyMCEEditor } from "tinymce";

export const useRefTinyMCE = () => {
  return useRef<TinyMCEEditor | null>(null);
};

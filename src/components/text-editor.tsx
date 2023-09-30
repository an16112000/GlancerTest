import { Box, type ColorScheme, LoadingOverlay } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Editor } from "@tinymce/tinymce-react";
import React, { memo } from "react";
import { useEffect, useRef, useState } from "react";
import { type Editor as TinyMCEEditor } from "tinymce";

import { keys } from "../constants";
import { env } from "../env/client.mjs";
import { useRender } from "../hooks";
import { FormLabel } from "./form-label";

const EDITOR_HEIGHT = 500;

type Props = {
  editorRef: React.MutableRefObject<TinyMCEEditor | null>;
  label?: string;
  initData?: string;
  withAsterisk?: boolean;
};

const _TextEditor: React.FC<Props> = ({ editorRef, label, initData, withAsterisk = false }) => {
  const oldContent = useRef<string>("");
  const { isRendered, reRender } = useRender();
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });
  const [loadingTinyMce, setLoadingTinyMce] = useState(true);

  useEffect(() => {
    if (theme) {
      oldContent.current = editorRef.current?.getContent() || "";

      reRender();

      setLoadingTinyMce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    if (!loadingTinyMce && initData) {
      setTimeout(() => {
        editorRef.current?.setContent(initData);
      }, 100);
    }
  }, [editorRef, initData, loadingTinyMce]);

  if (!isRendered) return <></>;

  return (
    <Box sx={{ ".tox-tinymce": { borderRadius: 5 } }}>
      {label && (
        <FormLabel>
          {label}{" "}
          {!!withAsterisk && (
            <span
              className="mantine-nhis4a mantine-InputWrapper-required mantine-TextInput-required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </FormLabel>
      )}

      <Box pos="relative" mih={EDITOR_HEIGHT}>
        <LoadingOverlay visible={loadingTinyMce} />

        <Editor
          apiKey={env.NEXT_PUBLIC_TINYMCE_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;

            setTimeout(() => {
              editor.setContent(oldContent.current);

              setLoadingTinyMce(false);
            }, 100);
          }}
          initialValue=""
          init={{
            skin: theme === "dark" ? "oxide-dark" : "oxide",
            content_css: theme === "dark" ? "dark" : "default",
            height: EDITOR_HEIGHT,
            menubar: false,
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat",
            content_style:
              "body { font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; font-size:14px }",
          }}
        />
      </Box>
    </Box>
  );
};

export const TextEditor = memo(_TextEditor);

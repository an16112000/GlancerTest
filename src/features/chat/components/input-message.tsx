import { Box, Input } from "@mantine/core";
import { IconSend } from "@tabler/icons";
import { type DocumentData, type QueryDocumentSnapshot, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type Props = {
  doc?: QueryDocumentSnapshot<DocumentData>;
};

export const InputMessage: React.FC<Props> = ({ doc }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (doc && session && session.user) {
      try {
        setMessage("");

        const conversationRef = doc.ref;

        const data = {
          message,
          sender: session.user.id,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(conversationRef, "messages"), data);

        /**
         * Tạm thời comment vì mỗi khi update list thì các conversation card sẽ bị rerender
         */
        // await updateDoc(conversationRef, {
        //   updatedAt: serverTimestamp(),
        // });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box p="md">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        rightSection={<IconSend size="1rem" />}
        onKeyDown={(e) => e.keyCode === 13 && void handleSend()}
      />
    </Box>
  );
};

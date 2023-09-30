import { Box, Divider, Flex, Paper, Text } from "@mantine/core";
import { type Unsubscribe, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import type { IMessage, ISelectedConversation } from "../../types";
import { InputMessage } from "./components";

type Props = {
  selectedConversation?: ISelectedConversation;
};

export const ChatWindow: React.FC<Props> = ({ selectedConversation }) => {
  const { data: session } = useSession();
  const [messageList, setMessageList] = useState<IMessage[]>([]);

  useEffect(() => {
    let unsubMessage: Unsubscribe;

    if (selectedConversation) {
      const {
        conversation: { doc },
      } = selectedConversation;

      const conversationRef = doc.ref;

      const messageQuery = query(collection(conversationRef, "messages"), orderBy("createdAt", "asc"));

      unsubMessage = onSnapshot(messageQuery, (docs) => {
        const messages: IMessage[] = [];

        docs.forEach((doc) => {
          const data = doc.data() as Omit<IMessage, "id">;

          messages.push({
            id: doc.id,
            ...data,
          });
        });

        setMessageList(messages);
      });
    }

    return () => {
      unsubMessage && unsubMessage();
    };
  }, [selectedConversation]);

  return (
    <Flex direction="column" h="100%">
      <Box sx={{ flex: 1 }}>
        {messageList.map((item) => (
          <Flex key={nanoid()} justify={session?.user?.id === item.sender ? "flex-end" : "flex-start"}>
            <Paper withBorder maw="80%" w="fit-content" py="xs" px="md" radius="xl" mx="sm" mt="xs">
              <Text>{item.message}</Text>
            </Paper>
          </Flex>
        ))}
      </Box>

      <Divider />

      <InputMessage doc={selectedConversation?.conversation.doc} />
    </Flex>
  );
};

import { Box, Input } from "@mantine/core";
import type { User } from "@prisma/client";
import { nanoid } from "nanoid";
import React from "react";

import { type IConversation } from "../../types";
import { ConversationCard } from "./components";

type Props = {
  dataSource: IConversation[];
  onSelect: (otherPerson: User, conversationId: IConversation) => void;
};

const _ListConversation: React.FC<Props> = ({ dataSource, onSelect }) => {
  console.log("rerender");

  return (
    <Box maw={350} w="100%" p="md" pos="relative">
      <Input placeholder="Tìm kiếm..." mb="xl" />

      {dataSource.map((conversation) => (
        <ConversationCard
          key={nanoid()}
          id={conversation.id}
          members={conversation.members}
          onSelect={(otherPerson) => onSelect(otherPerson, conversation)}
        />
      ))}
    </Box>
  );
};

export const ListConversation = React.memo(_ListConversation);

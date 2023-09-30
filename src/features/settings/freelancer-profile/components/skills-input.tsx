import { Badge, Center, Flex, Kbd, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons";
import { nanoid } from "nanoid";
import React, { useState } from "react";

type Props = {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
};

export const SkillsInput: React.FC<Props> = ({ skills, setSkills }) => {
  const [inputString, setInputString] = useState("");

  const handleAddNew = () => {
    const inputTrimmed = inputString.trim();

    if (!inputTrimmed) return;

    setSkills((arr) => [...arr, inputTrimmed]);

    setInputString("");
  };

  const handleRemove = (value: string) => {
    setSkills((arr) => arr.filter((item) => item !== value));
  };

  return (
    <>
      <TextInput
        label="Kĩ năng"
        onKeyDown={(key) => {
          if (key.keyCode === 13) {
            key.preventDefault();
            handleAddNew();
          }
        }}
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        rightSection={<Kbd>Enter</Kbd>}
        rightSectionWidth={52}
        placeholder="Tên kĩ năng..."
      />

      <Flex gap="xs" wrap="wrap" mt="sm">
        {skills.map((item) => (
          <Badge
            key={nanoid()}
            size="lg"
            rightSection={
              <Center sx={{ cursor: "pointer" }} onClick={() => handleRemove(item)}>
                <IconX size="0.8rem" />
              </Center>
            }
          >
            {item}
          </Badge>
        ))}
      </Flex>
    </>
  );
};

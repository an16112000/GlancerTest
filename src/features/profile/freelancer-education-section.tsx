import { Box, Divider, Flex, Group, Paper, type PaperProps, Text, Title } from "@mantine/core";
import type { Degree, Education } from "@prisma/client";
import { IconCalendar, IconFile, IconVocabulary } from "@tabler/icons";
import { nanoid } from "nanoid";
import React from "react";

type Props = PaperProps & {
  educations: (Education & {
    degree: Degree | null;
  })[];
};

export const FreelancerEducationSection: React.FC<Props> = ({ educations, ...props }) => {
  return (
    <Paper withBorder p="md" {...props}>
      <Title order={3} mb="lg">
        Học vấn
      </Title>

      <Flex direction="column" gap="md">
        {educations.map(({ school, area, degree, description, from, to }, index) => (
          <Box key={nanoid()}>
            <Text fw="bold">{school}</Text>

            <Group my="xs" spacing="xl">
              {from && (
                <Group spacing="xs">
                  <IconCalendar size="1rem" />

                  <Text fz="0.9rem" mt={-1}>
                    {from} - ${to ? to : "hiện tại"}
                  </Text>
                </Group>
              )}

              {area && (
                <Group spacing="xs">
                  <IconVocabulary size="1rem" />

                  <Text fz="0.9rem" mt={-1}>
                    {area}
                  </Text>
                </Group>
              )}

              {degree && (
                <Group spacing="xs">
                  <IconFile size="1rem" />

                  <Text fz="0.9rem" mt={-1}>
                    Bằng {degree.name.toLocaleLowerCase()}
                  </Text>
                </Group>
              )}
            </Group>

            {description && <Text fz="0.9rem">{description}</Text>}

            {index !== educations.length - 1 && <Divider my="lg" />}
          </Box>
        ))}
      </Flex>
    </Paper>
  );
};

import { Box, Divider, Flex, Group, Paper, type PaperProps, Text, Title } from "@mantine/core";
import type { Employment } from "@prisma/client";
import { IconAt, IconCalendar, IconIdBadge } from "@tabler/icons";
import { nanoid } from "nanoid";
import React from "react";

type Props = PaperProps & {
  employments: Employment[];
};

export const FreelancerEmploymentSection: React.FC<Props> = ({ employments, ...props }) => {
  return (
    <Paper withBorder p="md" {...props}>
      <Title order={3} mb="lg">
        Kinh nghiệm làm việc
      </Title>

      <Flex direction="column" gap="md">
        {employments.map(({ address, company, description, from, title, to }, index) => (
          <Box key={nanoid()}>
            <Text fw="bold">{company}</Text>

            <Group mt="xs" spacing="xl">
              <Group spacing="xs">
                <IconCalendar size="1rem" />

                <Text fz="0.9rem" mt={-1}>
                  {`${from} - ${to ? to : "hiện tại"}`}
                </Text>
              </Group>

              <Group spacing="xs">
                <IconIdBadge size="1rem" />

                <Text fz="0.9rem" mt={-1}>
                  {title}
                </Text>
              </Group>
            </Group>

            <Group mb="xs" spacing="xs">
              <IconAt size="1rem" />

              <Text fz="0.9rem" mt={-1}>
                {address}
              </Text>
            </Group>

            {description && <Text fz="0.9rem">{description}</Text>}

            {index !== employments.length - 1 && <Divider mt="lg" />}
          </Box>
        ))}
      </Flex>
    </Paper>
  );
};

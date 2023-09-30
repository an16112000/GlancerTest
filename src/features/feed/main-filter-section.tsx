import { Box, type BoxProps, Button, type ColorScheme, Divider, Paper } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import React, { useState } from "react";

import { InputPrice, SelectCategory } from "../../components";
import { keys } from "../../constants";
import type { FilterFeedProps } from "../../types";

const WIDTH = 350;

const projectLength = [
  {
    value: 30,
    label: "Dưới 1 tháng",
  },
  {
    value: 90,
    label: "1 - 3 tháng",
  },
  {
    value: 180,
    label: "3 - 6 tháng",
  },
  {
    value: 200,
    label: "Hơn 6 tháng",
  },
];

type Props = BoxProps & {
  setFilter: React.Dispatch<React.SetStateAction<FilterFeedProps>>;
};

export const MainFilterSection: React.FC<Props> = ({ setFilter, ...props }) => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  return (
    <Box miw={WIDTH} maw={WIDTH} py="xl" {...props}>
      <Paper px="xl" py="md" radius="md" shadow="sm" withBorder={theme === "dark"}>
        <SelectCategory
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value === null ? undefined : value)}
        />

        <Divider mt="xl" mb="md" />

        {/* <Radio.Group label="Thời hạn" onChange={(e) => console.log(e)}>
          <Flex direction="column" gap="xs">
            {projectLength.map(({ label, value }) => (
              <Radio key={nanoid()} value={value} label={label} />
            ))}
          </Flex>
        </Radio.Group>

        <Divider mt="xl" mb="md" /> */}

        <InputPrice label="Trả thấp nhất" mb="xs" value={minPrice} onChange={setMinPrice} />

        <InputPrice label="Trả cao nhất" value={maxPrice} onChange={setMaxPrice} />

        <Button
          fullWidth
          mt={50}
          onClick={() =>
            setFilter({
              categoryId: selectedCategory,
              minBudget: minPrice,
              maxBudget: maxPrice,
            })
          }
        >
          Lọc
        </Button>
      </Paper>
    </Box>
  );
};

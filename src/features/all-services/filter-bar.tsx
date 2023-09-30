import { Button, Flex, TextInput } from "@mantine/core";
import { IconFilter } from "@tabler/icons";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { InputPrice, SelectCategory } from "../../components";

type Props = {
  setFilterValues: Dispatch<
    SetStateAction<{
      categoryId: string | undefined;
      minPrice: number | undefined;
      maxPrice: number | undefined;
      searchString: string | undefined;
    }>
  >;
};

export const FilterBar: React.FC<Props> = ({ setFilterValues }) => {
  const [searchKeywords, setSearchKeywords] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchKeywords(value);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleChangeMinPrice = (price: number | undefined) => {
    setMinPrice(price);
  };

  const handleChangeMaxPrice = (price: number | undefined) => {
    setMaxPrice(price);
  };

  const handleFilter = () => {
    setFilterValues({ categoryId: selectedCategoryId || undefined, maxPrice, minPrice, searchString: searchKeywords });
  };

  return (
    <Flex gap={20}>
      <TextInput label="Từ khóa" placeholder="Nhập từ khóa" w={300} onChange={handleChangeSearch} />

      <SelectCategory placeholder="Chọn danh mục" onChange={handleSelectCategory} />

      <InputPrice label="Giá tối thiểu" placeholder="Nhập giá" min={0} onChange={handleChangeMinPrice} />

      <InputPrice label="Giá tối đa" placeholder="Nhập giá" onChange={handleChangeMaxPrice} />

      <Button mt={24} leftIcon={<IconFilter size="1rem" />} onClick={handleFilter}>
        Lọc
      </Button>
    </Flex>
  );
};

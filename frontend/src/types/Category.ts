export type CreateCategoryDto = {
  name: string;
};

export type CategoryDto = {
  categoryId: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export type CategoryWithCount = {
  category: CategoryDto;
  count: number;
};

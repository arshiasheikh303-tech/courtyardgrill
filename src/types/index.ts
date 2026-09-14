export type CartLine = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

export type MenuItemDTO = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isSpicy: boolean;
  isVeg: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  categoryId: string;
};

export type MenuCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  order: number;
  items: MenuItemDTO[];
};

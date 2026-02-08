export interface Category {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithCount extends Category {
  _count: {
    menuItems: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  featured: boolean;
  bestSeller: boolean;
  soldOut: boolean;
  active: boolean;
  sortOrder: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemWithCategory extends MenuItem {
  category: {
    id: string;
    name: string;
  };
}

export interface MenuFilters {
  search: string;
  categoryId: string;
  featured: string;
  bestSeller: string;
  soldOut: string;
}

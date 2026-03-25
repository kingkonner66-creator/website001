export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  featured?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

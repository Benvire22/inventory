export interface Category {
  id: string;
  title: string;
  description: string | null;
}

export interface Place {
  id: string;
  title: string;
  description: string | null;
}

export interface Item {
  id: string;
  categoryId: string;
  placeId: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: string;
}

export interface ItemMutation {
  categoryId: string;
  placeId: string;
  title: string;
  description: string | null;
  image: string | null;
}
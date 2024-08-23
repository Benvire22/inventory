import { promises as fs } from 'fs';
import { randomUUID } from 'node:crypto';
import { Category, Item, ItemMutation, Place } from './types';

const fileName = './db.json';

interface FileDb {
  categories: Category[];
  places: Place[];
  items: Item[];
}

let data: FileDb = {
  categories: [],
  places: [],
  items: [],
};

const fileDb = {
  async init() {
    try {
      const fileContents = await fs.readFile(fileName);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      console.error(e);
      data = {
        categories: [],
        places: [],
        items: [],
      };
    }
  },
  async getItems() {
    return data.items;
  },
  async getCategories() {
    return data.categories;
  },
  async getPlaces() {
    return data.places;
  },
  async addItem(item: ItemMutation) {
    const inventoryItem: Item = {
      id: randomUUID(),
      ...item,
      createdAt: new Date().toISOString(),
    };

    data.items.push(inventoryItem);
    await this.save();
    return inventoryItem;
  },
  async save() {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
  async deleteItem(itemId: string) {
    const items = data.items;
    const index = items.findIndex((item) => item.id === itemId);

    if (index > -1) {
      data.items.splice(index, 1);

      await this.save();
      return items[index];
    } else {
      return null;
    }
  },
  async findItem(currentType: string, type: string): Promise<Category | Place | null> {
    if (type === 'category') {
      const categories = data.categories;
      const currentCategory = categories.filter(
        (category) => category.title === currentType,
      );

      return currentCategory[0];
    } else if (type === 'place') {
      const places = data.places;
      const currentPlace = places.filter(
        (place) => place.title === currentType,
      );
      return currentPlace[0];
    } else {
      return null;
    }
  },
};

export default fileDb;

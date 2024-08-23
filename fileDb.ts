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
};

export default fileDb;

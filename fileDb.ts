import fs, { promises as fsPromises } from 'fs';
import { randomUUID } from 'node:crypto';
import {
  Category,
  CategoryMutation,
  Item,
  ItemMutation,
  Place,
  PlaceMutation,
} from './types';
import config from './config';
import path from 'path';

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
      const fileContents = await fsPromises.readFile(fileName);
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
    const newItem: Item = {
      id: randomUUID(),
      ...item,
      createdAt: new Date().toISOString(),
    };

    data.items.push(newItem);
    await this.save();
    return newItem;
  },
  async addCategory(category: CategoryMutation) {
    const newCategory: Category = {
      id: randomUUID(),
      ...category,
    };

    data.categories.push(newCategory);
    await this.save();
    return newCategory;
  },
  async addPlace(category: PlaceMutation) {
    const newPlace: Place = {
      id: randomUUID(),
      ...category,
    };

    data.places.push(newPlace);
    await this.save();
    return newPlace;
  },
  async save() {
    await fsPromises.writeFile(fileName, JSON.stringify(data, null, 2));
  },
  async deleteItem(itemId: string) {
    const items = [...data.items];
    const index = items.findIndex((item) => item.id === itemId);
    const imagePath = items[index].image;

    if (index > -1) {
      data.items.splice(index, 1);

      if (imagePath) {
        fs.unlink(path.join(config.publicPath, imagePath), (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }

      await this.save();
      return items[index];
    } else {
      return null;
    }
  },
  async deleteCategory(categoryId: string) {
    const categories = [...data.categories];
    const index = categories.findIndex(
      (category) => category.id === categoryId,
    );

    if (
      index > -1 &&
      data.items.filter((item) => item.categoryId !== categoryId).length > 0
    ) {
      data.categories.splice(index, 1);
      await this.save();

      return categories[index];
    } else {
      return null;
    }
  },
  async deletePlace(placeId: string) {
    const places = [...data.places];
    const index = places.findIndex((place) => place.id === placeId);

    if (
      index > -1 &&
      data.items.filter((item) => item.placeId !== placeId).length > 0
    ) {
      data.places.splice(index, 1);
      await this.save();

      return places[index];
    } else {
      return null;
    }
  },
  async findItem(
    currentValue: string,
    type: string,
  ): Promise<Category | Place | null> {
    if (type === 'category') {
      const categories = data.categories;
      const currentCategory = categories.filter(
        (category) => category.title === currentValue,
      );

      return currentCategory[0];
    } else if (type === 'place') {
      const places = data.places;
      const currentPlace = places.filter(
        (place) => place.title === currentValue,
      );
      return currentPlace[0];
    } else {
      return null;
    }
  },
};

export default fileDb;

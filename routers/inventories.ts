import express from 'express';
import fileDb from '../fileDb';
import { ItemMutation } from '../types';
import { imageUpload } from '../multer';

const inventoriesRouter = express.Router();

inventoriesRouter.get('/', async (_, res) => {
  const items = await fileDb.getItems();

  return res.send(
    items.map((item) => ({
      id: item.id,
      categoryId: item.categoryId,
      placeId: item.placeId,
      title: item.title,
    })),
  );
});

inventoriesRouter.get('/:id', async (req, res) => {
  const items = await fileDb.getItems();
  const item = items.find((item) => item.id === req.params.id);

  if (!item) {
    return res.status(404).send({ error: 'Item is not defined!' });
  }

  return res.send(item);
});

inventoriesRouter.post('/', imageUpload.single('image'), async (req, res) => {
  let categoryId = '';
  let placeId = '';

  if (!req.body.title || !req.body.place || !req.body.category) {
    return res
      .status(400)
      .send({ error: 'Title, place or category are required!' });
  } else if (req.body.place && req.body.category) {
    const category = req.body.category;
    const place = req.body.place;

    const currentCategory = await fileDb.findItem(category, 'category');
    const currentPlace = await fileDb.findItem(place, 'place');

    if (!currentCategory || !currentPlace) {
      return res
        .status(400)
        .send({ error: 'Category or place is not defined!' });
    }

    categoryId = currentCategory.id;
    placeId = currentPlace.id;
  }

  const item: ItemMutation = {
    categoryId,
    placeId,
    title: req.body.title,
    description: req.body.description || null,
    image: req.file ? req.file.filename : null,
  };

  const savedItem = await fileDb.addItem(item);
  return res.send(savedItem);
});

inventoriesRouter.delete('/:id', async (req, res) => {
  let itemId = req.params.id;
  if (itemId) {
    const deletedItem = await fileDb.deleteItem(itemId);

    if (!deletedItem) {
      return res
        .status(400)
        .send({ error: 'Item has not deleted or is not defined!' });
    }

    return res.send(deletedItem);
  } else {
    return res.status(400).send({ error: 'Item is not defined!' });
  }
});

export default inventoriesRouter;

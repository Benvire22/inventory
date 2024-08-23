import express from 'express';
import fileDb from '../fileDb';
import { ItemMutation } from '../types';
import { imageUpload } from '../multer';

const inventoriesRouter = express.Router();

inventoriesRouter.get('/', async (_, res) => {
  const items = await fileDb.getItems();
  return res.send(items);
});

inventoriesRouter.post('/', imageUpload.single('image'), async (req, res) => {
  if (!req.body.title || !req.body.place || req.body.category) {
    return res.status(400).send({error: 'Title, place or category are required!'});
  }

  const item: ItemMutation = {
    categoryId: req.body.category,
    placeId: req.body.place,
    title: req.body.title,
    description: req.body.description,
    image: req.file ? req.file.filename : null,
  };

  const savedItem = await fileDb.addItem(item);
  return res.send(savedItem);
});

export default inventoriesRouter;
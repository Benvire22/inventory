import express from 'express';
import fileDb from '../fileDb';
import { CategoryMutation } from '../types';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_, res) => {
  const categories = await fileDb.getCategories();

  return res.send(
    categories.map((category) => ({
      id: category.id,
      title: category.title,
    })),
  );
});

categoriesRouter.get('/:id', async (req, res) => {
  const categories = await fileDb.getCategories();
  const category = categories.find((category) => category.id === req.params.id);

  if (!category) {
    return res.status(404).send({ error: 'Category is not defined!' });
  }

  return res.send(category);
});

categoriesRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ error: 'Title category are required!' });
  }

  const category: CategoryMutation = {
    title: req.body.title,
    description: req.body.description || null,
  };

  const savedCategory = await fileDb.addCategory(category);
  return res.send(savedCategory);
});

categoriesRouter.put('/:id', async (req, res) => {
  const categories = await fileDb.getCategories();
  const id = req.params.id;

  if (!req.body.title || !id) {
    return res.status(400).send({ error: 'Error edit category!' });
  }

  const index = categories.findIndex((category) => category.id === id);

  const editedCategory = {
    id,
    title: req.body.title,
    description: req.body.description || null,
  };

  if (index !== -1) {
    categories[index] = editedCategory;
  } else {
    return res.status(400).send({ error: 'Category is not found!' });
  }

  await fileDb.editCategory(categories);
  return res.send(editedCategory);
});

categoriesRouter.delete('/:id', async (req, res) => {
  let categoryId = req.params.id;
  if (categoryId) {
    const deletedCategory = await fileDb.deleteCategory(categoryId);

    if (!deletedCategory) {
      return res
        .status(400)
        .send({ error: 'Category is not be deleted or not defined!' });
    }

    return res.send(deletedCategory);
  } else {
    return res.status(400).send({ error: 'Category is not defined!' });
  }
});

export default categoriesRouter;
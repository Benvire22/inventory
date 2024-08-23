import express from 'express';
import fileDb from '../fileDb';
import { PlaceMutation } from '../types';

const placesRouter = express.Router();

placesRouter.get('/', async (_, res) => {
  const places = await fileDb.getPlaces();
  return res.send(
    places.map((place) => ({
      id: place.id,
      title: place.title,
    })),
  );
});

placesRouter.get('/:id', async (req, res) => {
  const places = await fileDb.getPlaces();
  const place = places.find((place) => place.id === req.params.id);

  if (!place) {
    return res.status(404).send({ error: 'Place is not defined!' });
  }

  return res.send(place);
});

placesRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ error: 'Title place are required!' });
  }

  const place: PlaceMutation = {
    title: req.body.title,
    description: req.body.description || null,
  };

  const savedPlace = await fileDb.addPlace(place);
  return res.send(savedPlace);
});

placesRouter.delete('/:id', async (req, res) => {
  let placeId = req.params.id;
  if (placeId) {
    const deletedPlace = await fileDb.deletePlace(placeId);

    if (!deletedPlace) {
      return res
        .status(400)
        .send({ error: 'Place is not be deleted or not defined!' });
    }

    return res.send(deletedPlace);
  } else {
    return res.status(400).send({ error: 'Place is not defined!' });
  }
});

export default placesRouter;

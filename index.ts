import express from 'express';
import cors from 'cors';
import fileDb from './fileDb';
import { corsOptions } from './corsConfig';
import inventoriesRouter from './routers/inventories';
import categoriesRouter from './routers/categories';
import placesRouter from './routers/places';

const app = express();
const port = 8000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/inventories', inventoriesRouter);
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);

const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

void run().catch(console.error);
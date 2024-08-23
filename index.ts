import express from 'express';
import fileDb from './fileDb';
import cors from 'cors';
import inventoriesRouter from './routers/inventories';
import { corsOptions } from './corsConfig';
import categoriesRouter from './routers/categories';

const app = express();
const port = 8000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/inventories', inventoriesRouter);
app.use('/categories', categoriesRouter);

const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

void run().catch(console.error);

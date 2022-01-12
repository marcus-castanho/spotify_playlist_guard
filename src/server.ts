import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const router = express.Router();
app
  .use(express.json())
  .use(cors())
  .use('/', router);

router.get('/', (req:Request, res:Response) => res.status(200).send('The app in on!'));

app.listen(process.env.PORT);

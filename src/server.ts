import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const router = express.Router();

app.use(cors());

router.get('/', (req:Request, res:Response) => res.status(200).send('The app in on!'));

app.listen(process.env.PORT || 3030);

import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import moviesRouter from './routes/movies';
import { corsMiddleware } from './middlewares/cors';

dotenv.config();

const PORT: string | number = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.disable('x-powered-by');
app.use(corsMiddleware());

app.use('/movies', moviesRouter);

app.get('/', (req: Request, res: Response) => {
  res.send(
    `
    <div>
      <h2>Welcome to my api-rest</h2>
      <h4>
        <a href='/movies'>Go to movies<a/>
      </h4>
    </div>
    `
  );
});

app.listen(PORT, () => {
  console.log(`Home page app -> http://localhost:${PORT}/movies`);
});

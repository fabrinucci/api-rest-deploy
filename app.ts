import crypto from 'node:crypto';
import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import moviesData from './movies.json';
import { validateMovie, validatePartialMovie } from './schemas/MoviesSchema';

import {
  type Movie,
  type RequestBody,
  type RequestParams,
  type RequestQuery,
  type ResponseBody,
} from './types';

const movies: Movie[] = moviesData as Movie[];

dotenv.config();

const PORT: string | number = process.env.PORT || 4000;

const app = express();
app.disable('x-powered-by');
app.use(express.json());

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:8080',
];

/* Routes */
app.get(
  '/movies',
  (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) => {
    const origin = req.header('origin');
    if (ACCEPTED_ORIGINS.includes(origin!) || !origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    const { genre } = req.query;
    if (genre) {
      const filteredMovies = movies.filter((movies) =>
        movies.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      return res.json(filteredMovies);
    }

    res.json(movies);
  }
);

app.get('/movies/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({
    status: 'FAILED',
    msg: `Movie with id ${id} does not found`,
  });
});

app.post('/movies', (req: Request, res: Response) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    return res.status(400).send({
      status: 'FAILED',
      msg: JSON.parse(result.error.message),
    });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (!result.success) {
    return res.status(400).send({
      status: 'FAILED',
      msg: JSON.parse(result.error.message),
    });
  }

  if (movieIndex === -1) {
    return res.status(404).json({
      status: 'FAILED',
      msg: `Movie with id ${id} does not found`,
    });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  res.status(200).json(updateMovie);
});

app.listen(PORT, () => {
  console.log(`Home page app -> http://localhost:${PORT}/movies`);
});

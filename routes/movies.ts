import crypto from 'node:crypto';
import { Request, Response, Router } from 'express';
import { validateMovie, validatePartialMovie } from '../schemas/movies';
import {
  type Movie,
  type RequestBody,
  type RequestParams,
  type RequestQuery,
  type ResponseBody,
} from '../types';

import moviesData from '../movies.json';

const movies: Movie[] = moviesData as Movie[];
const router = Router();

router.get(
  '/',
  (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) => {
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

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({
    status: 'FAILED',
    msg: `Movie with id ${id} does not found`,
  });
});

router.post('/', (req: Request, res: Response) => {
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

router.patch('/:id', (req: Request, res: Response) => {
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

export default router;

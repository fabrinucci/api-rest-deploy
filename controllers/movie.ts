import { type Request, type Response } from 'express';
import {
  type RequestBody,
  type RequestParams,
  type RequestQuery,
  type ResponseBody,
} from '../types';
import { MovieModel } from '../models/movie';
import { validateMovie, validatePartialMovie } from '../schemas/movies';

export class MovieController {
  static async getAll(
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    return res.json(movies);
  }

  static async getById(
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);

    res.status(404).json({
      status: 'FAILED',
      msg: `Movie with id ${id} does not found`,
    });
  }

  static async create(
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) {
    const result = validateMovie(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 'FAILED',
        msg: JSON.parse(result.error.message),
      });
    }

    const newMovie = await MovieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  }

  static async update(
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).send({
        status: 'FAILED',
        msg: JSON.parse(result.error.message),
      });
    }
    const updateMovie = await MovieModel.update({
      id,
      input: result.data,
    });

    if (!updateMovie) {
      return res.status(404).json({
        status: 'FAILED',
        msg: `Movie with id ${id} does not found`,
      });
    }

    res.status(200).json(updateMovie);
  }

  static async delete(
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response
  ) {
    const { id } = req.params;

    const movie = await MovieModel.delete({ id });
    if (movie === false) {
      return res.status(404).json({
        status: 'FAILED',
        msg: `Movie with id ${id} does not found`,
      });
    }

    res.status(200).json(true);
  }
}

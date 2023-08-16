import crypto from 'node:crypto';
import {
  uuid,
  type Movie,
  type MovieController,
  type MovieOptional,
  type RequestParams,
  type RequestQuery,
} from '../types';
import moviesData from '../movies.json';

const movies: Movie[] = moviesData as Movie[];

export class MovieModel {
  static async getAll({ genre }: RequestQuery) {
    if (genre) {
      const filteredMovies = movies.filter((movies) =>
        movies.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      return filteredMovies;
    }
    return movies;
  }
  static async getById({ id }: { id: uuid }) {
    const movie = movies.find((movie) => movie.id === id);
    return movie;
  }

  static async create({ input }: { input: MovieController }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...input,
    };

    movies.push(newMovie);

    return newMovie;
  }

  static async update({ id, input }: { id: uuid; input: MovieOptional }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    const updateMovie = {
      ...movies[movieIndex],
      ...input,
    };

    if (movieIndex === -1) return false;

    movies[movieIndex] = updateMovie;
    return updateMovie;
  }

  static async delete({ id }: { id: uuid }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }
}

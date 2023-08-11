import z from 'zod';
import { type Movie, Genre } from '../types';

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required',
  }),
  director: z.string(),
  poster: z
    .string()
    .url()
    .endsWith('.jpg' || 'jpeg' || '.png' || '.webp'),
  year: z.number().int().min(1900).max(2030),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).optional(),
  genre: z
    .enum([
      Genre.Action,
      Genre.Adventure,
      Genre.Animation,
      Genre.Biography,
      Genre.Crime,
      Genre.Drama,
      Genre.Fantasy,
      Genre['Sci-Fi'],
      Genre.Suspense,
      Genre.Romance,
      Genre.Terror,
    ])
    .array(),
});

const validateMovie = (object: Movie) => {
  return movieSchema.safeParse(object);
};

const validatePartialMovie = (object: Movie) => {
  return movieSchema.partial().safeParse(object);
};

export { validateMovie, validatePartialMovie };

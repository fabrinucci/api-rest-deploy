export interface Movie {
  id: uuid;
  title: string;
  year: number;
  director: string;
  duration: number;
  poster: string;
  genre: Genre[];
  rate?: number;
}

export interface MovieController extends Omit<Movie, 'id'> {}
export interface MovieOptional extends Partial<MovieController> {}

export type uuid = `${string}-${string}-${string}-${string}-${string}`;

export enum Genre {
  Action = 'Action',
  Adventure = 'Adventure',
  Animation = 'Animation',
  Biography = 'Biography',
  Crime = 'Crime',
  Drama = 'Drama',
  Fantasy = 'Fantasy',
  'Sci-Fi' = 'Sci-Fi',
  Suspense = 'Suspense',
  Romance = 'Romance',
  Terror = 'Terror',
}

export interface RequestParams {
  id: uuid;
}
export interface ResponseBody {}
export interface RequestBody extends Movie {}
export interface RequestQuery {
  genre: string;
}

export type CatCategory = {
  id: string | number;
  name: string;
};

export type CatBreed = {
  id: string | number;
  name: string;
  temperament: string;
  life_span: string;
  alt_names: string;
  wikipedia_url: string;
  experimental: number;
  hairless: number;
  natural: number;
  rare: number;
  rex: number;
  suppress_tail: number;
  short_legs: number;
  hypoallergenic: number;
  adaptability: number;
  affection_level: number;
  country_code: string;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  grooming: number;
  health_issues: number;
  intelligence: number;
  shedding_level: number;
  social_needs: number;
  stranger_friendly: number;
  vocolisation: number;
};

export type CatImage = {
  id: string | number;
  url: string;
  categories: CatCategory[];
  breeds: CatBreed[];
};

export type CatImageShort = {
  id: string | number;
  url: string;
};

export type CatFavorite = {
  id: string | number;
  image_id: string;
  sub_id: string;
  created_at: string;
  image: CatImageShort;
};

export type PostCatFavoriteRequest = {
  image_id: string | number;
  sub_id: string;
};

export type GetCatCategoriesResponse = CatCategory[];
export type GetCatBreedsResponse = CatBreed[];
export type GetCatsResponse = CatImage[];
export type GetFavoriteCatsResponse = CatFavorite[];

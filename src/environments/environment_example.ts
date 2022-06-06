// Create 2 duplicate versions of this file: 'environment.ts' and 'environment.prod.ts'.
// Set 'production' to 'true' for the latter version.
// Add a valid apiKey to ensure a working application.

export const environment = {
  production: false,
  apiKey: '',
  endPoints: {
    breedList: 'https://api.thecatapi.com/v1/breeds',
    categoriesList: 'https://api.thecatapi.com/v1/categories',
    search: 'https://api.thecatapi.com/v1/images/search',
    favorites: 'https://api.thecatapi.com/v1/favourites',
  },
};

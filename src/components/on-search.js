import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.counter = 0;
    this.isFirstSearch = true;
  }

  async fatchImages() {
    const BASE_URL = 'https://pixabay.com/api';
    const API_KEY = '34695453-1e6d3abe8c76f1bde8697ab1b';
    const urlSearchParams = new URLSearchParams({
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: this.page,
    });

    try {
      const response = await axios.get(
        `${BASE_URL}/?q=${this.searchQuery}&${urlSearchParams}`
      );

      if (response.data.totalHits > 0 && this.isFirstSearch) {
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        this.isFirstSearch = false;
      }

      if (response.data.totalHits === 0) {
        Notify.failure(
          `Sorry there are no images matching your search query. Please try again`
        );

        return [];
      } else if (response.data.totalHits === this.counter) {
        Notify.failure(
          `We're sorry, but you've reached the end of search results`
        );
        return [];
      }

      this.counterImagesLoad(response.data.hits.length);
      this.incrementPage();

      return response.data.hits || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  incrementPage() {
    this.page += 1;
  }

  counterImagesLoad(data) {
    this.counter += data;
  }

  resetPage() {
    this.page = 1;
  }

  resetСounterImagesLoad() {
    this.counter = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

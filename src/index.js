import ImagesApiService from './components/on-search';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallaryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;
  if (imagesApiService.query === '') {
    return Notify.failure(`Enter search information`);
  }
  imagesApiService.resetPage();
  imagesApiService.resetСounterImagesLoad();

  imagesApiService.fatchImages().then(response => {
    cleanImagesContainer();

    appendImagesMarkup(response);
  });
}

function appendImagesMarkup(data) {
  if (data.length >= 40) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card"> <a class="photo-card__link" href="${largeImageURL}">
        <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
        <b>Likes <span class="info-item__text">${likes}</span></b>
        </p>
        <p class="info-item">
        <b>Views <span class="info-item__text">${views}</span></b>
        </p>
        <p class="info-item">
        <b>Comments <span class="info-item__text">${comments}</span></b>
        </p>
        <p class="info-item">
        <b>Downloads <span class="info-item__text">${downloads}</span></b>
        </p>
        </div> 
        </a>
      </div>
 `;
      }
    )
    .join('');

  refs.gallaryContainer.insertAdjacentHTML('beforeend', markup);

  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  gallery.on('show.simplelightbox', function () {});
}

function onLoadMore() {
  imagesApiService.fatchImages().then(appendImagesMarkup);
}

function cleanImagesContainer() {
  refs.gallaryContainer.innerHTML = '';
}

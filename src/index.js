import './sass/main.scss';
import './js/infinite_scroll';
import PixabayApiService from './js/apiService';
import photoTemplate from './templates/photo';
import getRefs from './js/getRefs';

// ================pnotify=======================//
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

import { openLightbox } from './js/lightbox';

const { cardContainer, searchForm } = getRefs();

const pixabayApiService = new PixabayApiService();

searchForm.addEventListener('submit', onSearch);
cardContainer.addEventListener('click', openLightbox);

function onSearch(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.query.value;
  pixabayApiService.query = searchQuery;
  if (pixabayApiService.query === '') {
    tooManyMatches();
    return;
  }
  pixabayApiService.resetPage();
  clearCardContainer();
  fetchPhotos();
}
async function fetchPhotos() {
  try {
    const hits = await pixabayApiService.fetchPhotos();
    if (hits.length === 0) {
      notFound();
      return;
    } else {
      appendPhotosMarkup(hits);
    }
  } catch (error) {
    console.log(error);
  }
}

function appendPhotosMarkup(photos) {
  cardContainer.insertAdjacentHTML('beforeend', photoTemplate(photos));
}

function clearCardContainer() {
  cardContainer.innerHTML = '';
}

function tooManyMatches() {
  error({
    text: 'Ні так не піде! Уведи хоч щось!!!',
    animation: 'fade',

    delay: 2000,
  });
  clearCardContainer();
}

function notFound() {
  error({
    text: 'Ану переглянь, що ти наклацав!!!',
    delay: 2000,
  });
  clearCardContainer();
}
// ===================================//

const options = {
  rootMargin: '150px',
};
const callback = entries => {
  entries.forEach(entry => {
    if (pixabayApiService.query !== '' && entry.isIntersecting) {
      fetchPhotos();
    }
  });
};

let observer = new IntersectionObserver(callback, options);

const sentinel = document.getElementById('sentinel');
observer.observe(sentinel);

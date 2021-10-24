import './sass/main.scss';
import PixabayApiService from './js/apiService';
import photoTemplate from './templates/photo';
import getRefs from './js/getRefs';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

// import * as basicLightbox from 'basiclightbox';

// const instance = basicLightbox.create(`
//     <img src="" width="800" height="600">
// `);

// instance.show();
// cardContainer.addEventListener('click', a);

// function a(event) {
//   const x = event.currentTarget;
//   console.log(x);
// }

const { cardContainer, searchForm, button } = getRefs();

const pixabayApiService = new PixabayApiService();

searchForm.addEventListener('submit', onSearch);
button.addEventListener('click', onClickButton);

function onClickButton(event) {
  fetchPhotos();
}

function onSearch(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.query.value;
  if (searchQuery === '') {
    tooManyMatches();
    return;
  }
  pixabayApiService.query = searchQuery;
  pixabayApiService.resetPage();
  clearCardContainer();
  fetchPhotos();
}

function fetchPhotos() {
  pixabayApiService.fetchPhotos().then(hits => {
    if (hits.length === 0) {
      notFound();
      return;
    } else {
      appendPhotosMarkup(hits);
      scrollToButton(button);
    }
  });
}

function appendPhotosMarkup(photos) {
  cardContainer.insertAdjacentHTML('beforeend', photoTemplate(photos));
}

function clearCardContainer() {
  cardContainer.innerHTML = '';
}

function scrollToButton(element) {
  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, 500);
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

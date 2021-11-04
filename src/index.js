import './sass/main.scss';
import PixabayApiService from './js/apiService';
import photoTemplate from './templates/photo';
import getRefs from './js/getRefs';

// ================pnotify=======================//
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

import { openLightbox } from './js/lightbox';

const { cardContainer, searchForm, button } = getRefs();

const pixabayApiService = new PixabayApiService();

searchForm.addEventListener('submit', onSearch);
button.addEventListener('click', onClickButton);
cardContainer.addEventListener('click', openLightbox);

function onClickButton(event) {
  fetchPhotos();
}

function onSearch(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.query.value;
  if (searchQuery === '') {
    addIsHiddenBtn();
    tooManyMatches();
    return;
  }
  pixabayApiService.query = searchQuery;
  pixabayApiService.resetPage();
  clearCardContainer();
  addIsHiddenBtn();
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
      scrollToButton(button);
      removeIsHiddenBtn();
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

function removeIsHiddenBtn() {
  button.classList.remove('is-hidden');
}

function addIsHiddenBtn() {
  button.classList.add('is-hidden');
}

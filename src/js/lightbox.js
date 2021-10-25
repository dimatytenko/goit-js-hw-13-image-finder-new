import * as basicLightbox from 'basiclightbox';

export function openLightbox(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  // console.log(event.target.dataset.source);
  const instance = basicLightbox.create(`
    <img src="${event.target.dataset.source}" width="800" height="600">
`);
  instance.show();
}

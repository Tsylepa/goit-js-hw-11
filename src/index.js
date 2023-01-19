import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api';
const KEY = '32917365-5bd31ba6b729a0861d5d37e11';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.gallery-guard');
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onInfinityLoad, options);
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});
let page = 1;

Notiflix.Notify.init({
  timeout: 1500,
  borderRadius: '4px',
});

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = '';

  fetchImages((page = 1))
    .then(({ data }) => {
      if (data.hits.length === 0) throw new Error();

      createMarkup(data);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      observer.observe(guard);
    })
    .catch(error =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

async function fetchImages(page) {
  try {
    return await axios.get(
      `${BASE_URL}?key=${KEY}&q=${form.searchQuery.value}&page=${page}&per_page=40`
    );
  } catch (error) {
    console.log(error);
  }
}

function createMarkup({ hits }) {
  const markup = [];

  hits.forEach(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      markup.push(
        `<a class="gallery__link" href="${largeImageURL}">
            <div class="photo-card">
              <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes:</b>${likes}
                </p>
                <p class="info-item">
                  <b>Views:</b>${views}
                </p>
                <p class="info-item">
                  <b>Comments:</b>${comments}
                </p>
                <p class="info-item">
                  <b>Downloads:</b>${downloads}
                </p>
              </div>
            </div>
        </a>`
      )
  );

  gallery.insertAdjacentHTML('beforeend', markup.join(''));
  lightbox.refresh();
}

function onInfinityLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchImages(page)
        .then(({ data }) => {
          if (data.hits.length === 0) {
            observer.unobserve(guard);
            throw new Error();
          }

          createMarkup(data);
        })
        .catch(error =>
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results.",
            {
              position: 'center-bottom',
            }
          )
        );
    }
  });
}

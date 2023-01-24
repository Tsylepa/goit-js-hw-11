import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.gallery-guard');
const loader = document.querySelector('.loader');
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

async function onSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = '';

  try {
    const { data } = await fetchImages((page = 1));
    const { hits, totalHits } = data;

    if (hits.length === 0) throw new Error();
    createMarkup(data);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    observer.observe(guard);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function fetchImages(page) {
  const searchParams = new URLSearchParams({
    key: '32917365-5bd31ba6b729a0861d5d37e11',
    q: form.searchQuery.value,
    per_page: 40,
    page: page,
  });

  try {
    loader.classList.remove('is-hidden');
    return await axios.get(`${BASE_URL}?${searchParams}`);
  } catch (error) {
    console.log(error);
  } finally {
    loader.classList.add('is-hidden');
  }
}

function createMarkup({ hits }) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
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
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function onInfinityLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMore();
    }
  });
}

async function loadMore() {
  try {
    page += 1;
    const { data } = await fetchImages(page);

    if (data.hits.length === 0) {
      observer.unobserve(guard);
      throw new Error();
    }

    createMarkup(data);
  } catch (error) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        position: 'center-bottom',
      }
    );
  }
}

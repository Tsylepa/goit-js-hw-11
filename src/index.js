import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import styles from 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api';
const KEY = '32917365-5bd31ba6b729a0861d5d37e11';
const search = document.querySelector('.js-search');
const form = document.querySelector('.js-searchform');
const gallery = document.querySelector('.gallery');

// form.addEventListener('submit', onSubmit);
new SimpleLightbox('.gallery a', {
  aptionsData: 'alt',
  captionDelay: '250',
});
// function onSubmit(e) {
//   e.preventDefault();

//   fetchImages().then(async response => await showResult(response.data));
// }

// async function fetchImages() {
//   try {
//     return await axios.get(`${BASE_URL}?key=${KEY}&q=${search.value}`);
//   } catch (error) {
//     console.log(error);
//   }
// }

// function showResult({ hits }) {
//   const markup = [];

//   hits.forEach(
//     ({
//       webformatURL,
//       largeImageURL,
//       tags,
//       likes,
//       views,
//       comments,
//       downloads,
//     }) =>
//       markup.push(
//         `<a href="${largeImageURL}"><div class="photo-card">
//         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//         <div class="info">
//           <p class="info-item">
//             <b>Likes: ${likes}</b>
//           </p>
//           <p class="info-item">
//             <b>Views: ${views}</b>
//           </p>
//           <p class="info-item">
//             <b>Comments: ${comments}</b>
//           </p>
//           <p class="info-item">
//             <b>Downloads: ${downloads}</b>
//           </p>
//             </div>
//         </div>
//       </a>`
//       )
//   );

//   gallery.innerHTML = markup.join('');
// }

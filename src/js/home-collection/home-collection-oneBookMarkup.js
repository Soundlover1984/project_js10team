// import { openModal } from './../book-modal/modal';
const defaultBookImage = require('../../images/defaultBook_180_x_256.png');

function createOneBookMarkup(book) {
  const { _id, author, title, list_name, book_image = defaultBookImage } = book;
  return `
    <li class="book">
      <a class='book__link'>
        <div class="book__frame">
          <img
            class="book__image"
            src='${book_image}'
            alt='book image'
            data-id="${_id}"
            loading="lazy"
          />
        </div>      
        <h3 class="book__title" >${title}</h3>
        <p class="book__author">${author}</p>
      </a>
    </li>
    `;
}

export { createOneBookMarkup };
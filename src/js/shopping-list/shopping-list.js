import debounce from 'lodash.debounce';
import Pagination from 'tui-pagination';
import { createCardsMarkup } from './shopping-list-markup';
import { notifyInit } from './shoping-list-const';
import { emptyShoppingListNotify } from './shoping-list-const';
import { viewportMediaConst } from './shoping-list-const';

// import '../side-bar/supportCreateList';
// import '../side-bar/supportSwiper';

//=======================================================================================
// load() - load functions on this page ("main" function)
// drawShoppingCardsList() - check local storage and draw shopping list content
//=======================================================================================

const emptyShoppingPage = document.querySelector('.sh-list__empty');
const cardsContainer = document.querySelector('.sh-list__books-list');
const paginationBarContainer = document.getElementById('pagination');

let previousMediaWidth = getCurrentMediaWidth();

function load() {
  notifyInit();
  drawShoppingCardsList();
  addEventListenerWindow();
}

export function drawShoppingCardsList() {
  const shoppingList = getSoppingList();

  if (!shoppingList || shoppingList.length === 0) {
    // emptyShoppingPage.classList.remove('js-hidden');
    emptyShoppingListNotify();
  } else {
    // emptyShoppingPage.classList.add('js-hidden');
    emptyShoppingPage.innerHTML = '';
    shoppingListPagination(shoppingList);
  }
}

function getSoppingList() {
  let shoppingList = [];
  try {
    shoppingList = JSON.parse(localStorage.getItem('SHOPPING_LIST_KEY'));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to parse data from localStorage');
  }
  return shoppingList;
}

function shoppingListPagination(shoppingList) {
  const currentMediaWidth = getCurrentMediaWidth();
  const paginationParameters = calculatePaginationParameters(currentMediaWidth);
  const paginatedShoppingList = createPaginatedShoppingList(
    shoppingList,
    paginationParameters.itemsPerPage
  );

  const paginationBarTemplate = {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  };

  const paginationOptions = {
    totalItems: shoppingList.length,
    itemsPerPage: paginationParameters.itemsPerPage,
    visiblePages: paginationParameters.buttonsPerPage,
    page: 1,
    centerAlign: false,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: paginationBarTemplate,
    usageStatistics: false,
  };

  if (shoppingList.length <= paginationParameters.itemsPerPage) {
    paginationBarContainer.classList.add('js-hidden');
  } else {
    paginationBarContainer.classList.remove('js-hidden');
  }

  const pagination = new Pagination(paginationBarContainer, paginationOptions);
  pagination.on('afterMove', ({ page }) => {
    drawShoppingCardsPage(paginatedShoppingList[page - 1]);
  });

  let firstLoadPage = pagination.getCurrentPage();
  drawShoppingCardsPage(paginatedShoppingList[firstLoadPage - 1]);

  addEventListenerToRemoveButton();
}

function calculatePaginationParameters(currentMediaWidth) {
  let itemsPerPage;
  let buttonsPerPage;

  switch (currentMediaWidth) {
    case viewportMediaConst.desktop_4K:
      itemsPerPage = 3;
      buttonsPerPage = 3;
      break;
    case viewportMediaConst.laptop_L:
      itemsPerPage = 3;
      buttonsPerPage = 3;
      break;
    case viewportMediaConst.laptop:
      itemsPerPage = 3;
      buttonsPerPage = 3;
      break;
    case viewportMediaConst.tablet:
      itemsPerPage = 3;
      buttonsPerPage = 3;
      break;
    case viewportMediaConst.mobile_L:
      itemsPerPage = 4;
      buttonsPerPage = 2;
      break;
    case viewportMediaConst.mobile_M:
      itemsPerPage = 4;
      buttonsPerPage = 2;
      break;
    case viewportMediaConst.mobile_S:
      itemsPerPage = 4;
      buttonsPerPage = 2;
      break;
    default:
      itemsPerPage = 4;
      buttonsPerPage = 2;
  }

  const paginationParameters = {
    itemsPerPage: itemsPerPage,
    buttonsPerPage: buttonsPerPage,
  };

  return paginationParameters;
}

function createPaginatedShoppingList(shoppingList, itemsPerPage) {
  const paginatedShoppingList = [];
  for (let i = 0; i < shoppingList.length; i += itemsPerPage) {
    paginatedShoppingList.push(shoppingList.slice(i, i + itemsPerPage));
  }
  return paginatedShoppingList;
}

function drawShoppingCardsPage(shoppingListPage) {
  const cardsMarkup = createCardsMarkup(shoppingListPage);
  cardsContainer.innerHTML = cardsMarkup;
}

function addEventListenerWindow() {
  window.addEventListener('resize', debounce(viewporthHandler, 250));
}

function viewporthHandler(event) {
  let currentMediaWidth = getCurrentMediaWidth();
  if (previousMediaWidth != currentMediaWidth) {
    drawShoppingCardsList();
    previousMediaWidth = currentMediaWidth;
  }
}

function getCurrentMediaWidth() {
  let currentViewport = document.documentElement.clientWidth;
  let currentMediaWidth;
  if (currentViewport >= viewportMediaConst.desktop_4K) {
    currentMediaWidth = viewportMediaConst.desktop_4K;
  } else if (currentViewport >= viewportMediaConst.laptop_L) {
    currentMediaWidth = viewportMediaConst.laptop_L;
  } else if (currentViewport >= viewportMediaConst.laptop) {
    currentMediaWidth = viewportMediaConst.laptop;
  } else if (currentViewport >= viewportMediaConst.tablet) {
    currentMediaWidth = viewportMediaConst.tablet;
  } else if (currentViewport >= viewportMediaConst.mobile_L) {
    currentMediaWidth = viewportMediaConst.mobile_L;
  } else if (currentViewport >= viewportMediaConst.mobile_M) {
    currentMediaWidth = viewportMediaConst.mobile_M;
  } else {
    currentMediaWidth = viewportMediaConst.mobile_S;
  }
  return currentMediaWidth;
}

function onRemoveCard(event) {
  if (event.target.closest('.shop-card__delete')) {
    const bookShopCard = event.target.closest('.shop-card');
    const bookId = bookShopCard.dataset.id;
    bookShopCard.remove();
    removeFromLocalStorage(bookId);
    drawShoppingCardsList();
  }
}

function removeFromLocalStorage(id) {
  try {
    let shoppingList = JSON.parse(localStorage.getItem('SHOPPING_LIST_KEY'));
    let updatedShoppingList = shoppingList.filter(item => item._id != id);
    localStorage.setItem(
      'SHOPPING_LIST_KEY',
      JSON.stringify(updatedShoppingList)
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to parse data from localStorage');
  }

  if (JSON.parse(localStorage.getItem('SHOPPING_LIST_KEY')).length == 0) {
    localStorage.removeItem('SHOPPING_LIST_KEY');
  }
}

function addEventListenerToRemoveButton() {
  cardsContainer.addEventListener('click', onRemoveCard);
}

//----------------------------------------------------------------
load();

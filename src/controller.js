import View from './view.js';
import Model from './model.js';

const Controller = {
  init: () => {
    const btnNewBook = document.querySelector('#btn_new_book');
    const backdrop = document.querySelector('#backdrop');

    btnNewBook.addEventListener('click', () => {
      Controller.formBook();
    });
    backdrop.addEventListener('click', () => {
      Controller.toggleModal();
    });

    Controller.initBooks();
  },
  initBooks: () => {
    const completeShelves = document.querySelector('.complete .books');
    const notCompleteShelves = document.querySelector('.not_complete .books');
    const inputSearch = document.querySelector('#search_book_input');

    Model.getBookFromStorage();

    Controller.emptyBook([...Model.books.complete, ...Model.books.notComplete]);

    completeShelves.innerHTML = Model.books.complete.map((el) => View.book({
      id: el.id, title: el.title, author: el.author, year: el.year, isComplete: el.isComplete,
    })).join('');
    notCompleteShelves.innerHTML = Model.books.notComplete.map((el) => View.book({
      id: el.id, title: el.title, author: el.author, year: el.year, isComplete: el.isComplete,
    })).join('');

    Controller.bookAction({ completeShelves, notCompleteShelves });

    inputSearch.addEventListener('input', () => {
      Model.bookSearch({ title: inputSearch.value }, (result) => {
        Controller.emptyBook([...result]);

        completeShelves.innerHTML = result.filter((el) => el.isComplete === true)
          .map((el) => View.book({
            id: el.id, title: el.title, author: el.author, year: el.year, isComplete: el.isComplete,
          })).join('');
        notCompleteShelves.innerHTML = result.filter((el) => el.isComplete === false)
          .map((el) => View.book({
            id: el.id, title: el.title, author: el.author, year: el.year, isComplete: el.isComplete,
          })).join('');

        Controller.bookAction({ completeShelves, notCompleteShelves });
      });
    });
  },
  bookAction: ({ completeShelves, notCompleteShelves }) => {
    const modal = document.querySelector('#modal');

    [...completeShelves.children, ...notCompleteShelves.children].forEach((el) => {
      const { id } = el;

      const tooltipComplete = el.querySelector('.tooltip_btn_complete');
      const tooltipDelete = el.querySelector('.tooltip_btn_not_complete');
      const btnComplete = el.querySelector('.btn_complete');
      const btnDelete = el.querySelector('.btn_delete');

      btnComplete.addEventListener('mouseover', () => tooltipComplete.style.opacity = 1);
      btnComplete.addEventListener('mouseleave', () => tooltipComplete.style.opacity = 0);
      btnDelete.addEventListener('mouseover', () => tooltipDelete.style.opacity = 1);
      btnDelete.addEventListener('mouseleave', () => tooltipDelete.style.opacity = 0);

      btnComplete.addEventListener('click', () => Model.bookSwap({ id }, () => Controller.initBooks()));
      btnDelete.addEventListener('click', () => {
        Model.bookDelete({ id }, (title) => {
          Controller.toggleModal();
          modal.innerHTML = View.deletePopup({ title });
          Controller.initBooks();
        });
      });
    });
  },
  toggleModal: () => {
    const modal = document.querySelector('#modal');
    const backdrop = document.querySelector('#backdrop');

    if (modal.classList.contains('modal_on')) {
      modal.classList.remove('modal_on');
      backdrop.classList.remove('backdrop_on');
    } else {
      modal.classList.add('modal_on');
      backdrop.classList.add('backdrop_on');
    }
  },
  formBook: () => {
    const modal = document.querySelector('#modal');

    Controller.toggleModal();

    modal.innerHTML = View.formInputBook();

    modal.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const errorText = document.querySelector('form small');

      const title = document.querySelector('#title_input').value;
      const author = document.querySelector('#author_input').value;
      const year = document.querySelector('#year_input').value;
      const isComplete = document.querySelector('#complete_chkbox').checked;

      const id = `${title}-${new Date()}`;

      if (title === '') {
        errorText.innerHTML = 'field title required!';
      } else if (author === '') {
        errorText.innerHTML = 'field author required!';
      } else if (year <= 0) {
        errorText.innerHTML = 'field year not valid!';
      } else {
        errorText.innerHTML = '';

        Model.saveBook({
          id, title, author, year, isComplete,
        }, () => {
          Controller.toggleModal();
          Controller.initBooks();
        });
      }
    });
  },
  emptyBook: (books, message) => {
    const shelvesContainer = document.querySelector('.shelves');
    const emptyContainer = document.querySelector('.empty');

    if (books.length === 0 || !books) {
      shelvesContainer.classList.add('empty-list');
      emptyContainer.classList.add('empty-list');
    } else {
      shelvesContainer.classList.remove('empty-list');
      emptyContainer.classList.remove('empty-list');
    }
  },
};

export default Controller;

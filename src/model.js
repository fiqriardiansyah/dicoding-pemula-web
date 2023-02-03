const Model = {
  books: {
    complete: [],
    notComplete: [],
  },
  saveBook: ({
    id, title, author, year, isComplete,
  }, finish) => {
    Model.getBookFromStorage();

    if (isComplete) {
      Model.books = {
        notComplete: Model.books.notComplete,
        complete: [...Model.books.complete, {
          id, title, author, year, isComplete,
        }],
      };
    } else {
      Model.books = {
        complete: Model.books.complete,
        notComplete: [...Model.books.notComplete, {
          id, title, author, year, isComplete,
        }],
      };
    }

    Model.saveBookToStorage();
    finish();
  },
  getBookFromStorage: () => {
    const books = localStorage.getItem('books');
    Model.books = books === null ? Model.books : JSON.parse(books);
  },
  saveBookToStorage: () => {
    const books = JSON.stringify(Model.books);
    localStorage.setItem('books', books);
  },
  bookSwap: ({ id }, finish) => {
    Model.getBookFromStorage();

    const book = [...Model.books.complete, ...Model.books.notComplete].filter((el) => el.id === id)[0];

    const notComplete = Model.books.notComplete.filter((el) => el.id !== id);
    const complete = Model.books.complete.filter((el) => el.id !== id);

    if (book.isComplete) {
      Model.books = {
        notComplete: [...notComplete, { ...book, isComplete: false }],
        complete: [...complete],
      };
    } else {
      Model.books = {
        complete: [...complete, { ...book, isComplete: true }],
        notComplete: [...notComplete],
      };
    }

    Model.saveBookToStorage();
    finish();
  },
  bookDelete: ({ id }, finish) => {
    Model.getBookFromStorage();
    const book = [...Model.books.complete, ...Model.books.notComplete].filter((el) => el.id === id)[0];
    Model.books = {
      complete: [...Model.books.complete.filter((el) => el.id !== id)],
      notComplete: [...Model.books.notComplete.filter((el) => el.id !== id)],
    };
    Model.saveBookToStorage();
    finish(book.title);
  },
  bookSearch: ({ title }, result) => {
    const books = [...Model.books.complete, ...Model.books.notComplete].filter((el) => {
      if (Model.lowerCaseText(el.title).includes(Model.lowerCaseText(title))) {
        return el;
      }
    });
    result(books);
  },
  cutText: (text) => (text.length > 20 ? `${text.slice(0, 20)}...` : text),
  lowerCaseText: (text) => {
    let newStr = '';
    for (let i = 0; i < text.length; i++) {
      let code = text.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        code += 32;
      }
      newStr += String.fromCharCode(code);
    }
    return newStr;
  },

};

export default Model;

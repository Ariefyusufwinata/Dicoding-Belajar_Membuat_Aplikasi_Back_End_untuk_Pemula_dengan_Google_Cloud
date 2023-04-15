const books = require('../models/books');
const CONSTANT = require('../helper/constant');
const { nanoid } = require('nanoid');

const root = (_, res) => {
     return res
          .response({
               Welcome: CONSTANT.DASHBOARD,
          });
}

const addBook = (req, res) => {

     const {
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
     } = req.payload;

     if (!name) {
          const response = res
               .response({
                    status: CONSTANT.FAIL,
                    message: 'Gagal menambahkan buku. Mohon isi nama buku',
               })
               .code(400);
          return response;
     }

     if (readPage > pageCount) {
          const response = res
               .response({
                    status: CONSTANT.FAIL,
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
               })
               .code(400);
          return response;
     }

     const id = nanoid(21);
     const finished = pageCount === readPage;
     const insertedAt = new Date().toISOString();
     const updatedAt = insertedAt;

     const book = {
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          id,
          finished,
          insertedAt,
          updatedAt,
     };
     books.push(book);

     const isSuccess = books.filter((note) => note.id === id).length > 0;
     if (isSuccess) {
          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    message: 'Buku berhasil ditambahkan',
                    data: {
                         bookId: id,
                    },
               })
               .code(201);
          return response;
     }

     const response = res
          .response({
               status: CONSTANT.FAIL,
               message: 'Buku gagal ditambahkan',
          })
          .code(500);
     return response;
};

const getAllBooks = (req, res) => {

     const { 
          name, 
          reading, 
          finished 
     } = req.query

     if (!name && !reading && !finished) {
          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    data: {
                         books: books.map((book) => ({
                              id: book.id,
                              name: book.name,
                              publisher: book.publisher,
                         })),
                    },
               })
               .code(200);
          return response;
     }

     if (name) {
          const filteredBooksName = books.filter((book) => {
               const regex= new RegExp(name, 'gi');
               return regex.test(book.name);
          });
          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    data: {
                         books: filteredBooksName.map((book) => ({
                              id: book.id,
                              name: book.name,
                              publisher: book.publisher,
                         })),
                    },
               })
               .code(200);
          return response;
     }

     if (reading) {
          const filteringBooksRead = books.filter(
               (book) => Number(book.reading) === Number(reading),
          );
          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    data: {
                         books: filteringBooksRead.map((book) => ({
                              id: book.id,
                              name: book.name,
                              publisher: book.publisher,
                         })),
                    },
               })
               .code(200);
          return response;
     }

     const filteringFinishedRead = books.filter(
          (book) => Number(book.finished) === Number(finished),
     );

     const response = res
          .response({
               status: CONSTANT.SUCCESS,
               data: {
                    books: filteringFinishedRead.map((book) => ({
                         id: book.id,
                         name: book.name,
                         publisher: book.publisher,
                    })),
               },
          })
          .code(200);

     return response;
};

const getBookById = (req, res) => {

     const {
          bookId
     } = req.params;

     const book = books.filter((n) => n.id === bookId)[0];

     if (book) {
          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    data: {
                         book,
                    },
               })
               .code(200);
          return response;
     }

     const response = res
          .response({
               status: CONSTANT.FAIL,
               message: 'Buku tidak ditemukan',
          })
          .code(404);
     return response;
};

const editBookById = (req, res) => {
     
     const { 
          bookId 
     } = req.params;

     const {
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
     } = req.payload;

     if (!name) {
          const response = res
               .response({
                    status: CONSTANT.FAIL,
                    message: 'Gagal memperbarui buku. Mohon isi nama buku',
               })
               .code(400);
          return response;
     }

     if (readPage > pageCount) {
          const response = res
               .response({
                    status: CONSTANT.FAIL,
                    message:
                         'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
               })
               .code(400);
          return response;
     }

     const finished = pageCount === readPage;
     const updatedAt = new Date().toISOString();

     const index = books.findIndex((note) => note.id === bookId);

     if (index !== -1) {
          books[index] = {
               ...books[index],
               name,
               year,
               author,
               summary,
               publisher,
               pageCount,
               readPage,
               reading,
               finished,
               updatedAt,
          };

          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    message: 'Buku berhasil diperbarui',
               })
               .code(200);
          return response;
     }

     const response = res
          .response({
               status: CONSTANT.FAIL,
               message: 'Gagal memperbarui buku. Id tidak ditemukan',
          })
          .code(404);
     return response;
};

const deleteBookById = (req, res) => {
     const { bookId } = req.params;

     const index = books.findIndex((note) => note.id === bookId);

     if (index !== -1) {
          books.splice(index, 1);

          const response = res
               .response({
                    status: CONSTANT.SUCCESS,
                    message: 'Buku berhasil dihapus',
               })
               .code(200);
          return response;
     }

     const response = res
          .response({
               status: CONSTANT.FAIL,
               message: 'Buku gagal dihapus. Id tidak ditemukan',
          })
          .code(404);
     return response;
};

module.exports = {
     root,
     addBook,
     getAllBooks,
     getBookById,
     editBookById,
     deleteBookById,
}
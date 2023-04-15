const {
     root,
     addBook,
     getAllBooks,
     getBookById,
     editBookById,
     deleteBookById,
} = require('../controllers/controllers')

const routes = [
     //Root Element
     {
          method: 'GET',
          path: '/',
          handler: root,
     },
     //1. SUBMISSION - POST 
     {
          method: 'POST',
          path: '/books',
          handler: addBook,
     },
     //2. SUBMISSION - GET
     {
          method: 'GET',
          path: '/books',
          handler: getAllBooks,
     },
     {
          method: 'GET',
          path: '/books/{bookId}',
          handler: getBookById,
     },
     //3. SUBMISSION - PUT
     {
          method: 'PUT',
          path: '/books/{bookId}',
          handler: editBookById,
     },
     //4. SUBMISSION - DELETE
     {
          method: 'DELETE',
          path: '/books/{bookId}',
          handler: deleteBookById,
     },
];

module.exports = routes;
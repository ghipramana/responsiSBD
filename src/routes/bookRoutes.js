import express from 'express';
import { BookController } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', BookController.getAllBooks);         // GET /api/books?title=
router.get('/:id', BookController.getBookById);     // GET /api/books/:id
router.post('/', BookController.createBook);        // POST /api/books
router.put('/:id', BookController.updateBook);      // PUT /api/books/:id
router.delete('/:id', BookController.deleteBook);   // DELETE /api/books/:id

export default router;

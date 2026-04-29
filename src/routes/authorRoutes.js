import express from 'express';
import { AuthorController } from '../controllers/authorController.js';

const router = express.Router();

router.get('/', AuthorController.getAuthors);          // GET /api/authors?name=
router.get('/:id', AuthorController.getAuthorById);    // GET /api/authors/:id
router.post('/', AuthorController.addAuthor);          // POST /api/authors
router.put('/:id', AuthorController.updateAuthor);     // PUT /api/authors/:id
router.delete('/:id', AuthorController.deleteAuthor);  // DELETE /api/authors/:id

export default router;

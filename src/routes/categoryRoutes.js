import express from 'express';
import { CategoryController } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', CategoryController.getCategories);          // GET /api/categories?name=
router.get('/:id', CategoryController.getCategoryById);     // GET /api/categories/:id
router.post('/', CategoryController.addCategory);           // POST /api/categories
router.put('/:id', CategoryController.updateCategory);      // PUT /api/categories/:id
router.delete('/:id', CategoryController.deleteCategory);   // DELETE /api/categories/:id

export default router;

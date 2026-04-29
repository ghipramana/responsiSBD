import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {
  // GET /api/categories?name=...
  async getCategories(req, res) {
    try {
      const { name } = req.query;
      const categories = await CategoryModel.getAll(name || null);
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/categories/:id
  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/categories
  async addCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /api/categories/:id
  async updateCategory(req, res) {
    try {
      const category = await CategoryModel.update(req.params.id, req.body.name);
      if (!category) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
      res.json({ message: 'Kategori berhasil diperbarui.', data: category });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE /api/categories/:id
  async deleteCategory(req, res) {
    try {
      const existing = await CategoryModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
      const result = await CategoryModel.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

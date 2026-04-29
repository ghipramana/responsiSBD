import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  // GET /api/authors?name=...
  async getAuthors(req, res) {
    try {
      const { name } = req.query;
      const authors = await AuthorModel.getAll(name || null);
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/authors/:id
  async getAuthorById(req, res) {
    try {
      const author = await AuthorModel.getById(req.params.id);
      if (!author) return res.status(404).json({ error: 'Penulis tidak ditemukan.' });
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/authors
  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /api/authors/:id
  async updateAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.update(req.params.id, name, nationality);
      if (!author) return res.status(404).json({ error: 'Penulis tidak ditemukan.' });
      res.json({ message: 'Data penulis berhasil diperbarui.', data: author });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE /api/authors/:id
  async deleteAuthor(req, res) {
    try {
      const existing = await AuthorModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Penulis tidak ditemukan.' });
      const result = await AuthorModel.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

import { BookModel } from '../models/bookModel.js';

export const BookController = {
  // GET /api/books?title=...
  async getAllBooks(req, res) {
    try {
      const { title } = req.query;
      const books = await BookModel.getAll(title || null);
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/books/:id
  async getBookById(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/books
  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /api/books/:id
  async updateBook(req, res) {
    try {
      const book = await BookModel.update(req.params.id, req.body);
      if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
      res.json({ message: 'Data buku berhasil diperbarui.', data: book });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE /api/books/:id
  async deleteBook(req, res) {
    try {
      const existing = await BookModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
      const result = await BookModel.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

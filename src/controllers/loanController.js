import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
  // GET /api/loans
  async getLoans(req, res) {
    try {
      const loans = await LoanModel.getAllLoans();
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/loans/:id
  async getLoanById(req, res) {
    try {
      const loan = await LoanModel.getById(req.params.id);
      if (!loan) return res.status(404).json({ error: 'Data peminjaman tidak ditemukan.' });
      res.json(loan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/loans
  async createLoan(req, res) {
    const { book_id, member_id, due_date } = req.body;
    try {
      const loan = await LoanModel.createLoan(book_id, member_id, due_date);
      res.status(201).json({
        message: 'Peminjaman berhasil dicatat!',
        data: loan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // ============================================================
  // TUGAS 3: PATCH /api/loans/:id/return
  // Endpoint khusus pengembalian buku
  // ============================================================
  async returnBook(req, res) {
    try {
      const result = await LoanModel.returnBook(req.params.id);
      res.json({
        message: 'Buku berhasil dikembalikan!',
        loan: result.loan,
        book_stock_updated: {
          book_id: result.book.id,
          title: result.book.title,
          available_copies: result.book.available_copies,
          total_copies: result.book.total_copies
        }
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // ============================================================
  // TUGAS 4: GET /api/reports/stats
  // Statistik perpustakaan
  // ============================================================
  async getStats(req, res) {
    try {
      const stats = await LoanModel.getStats();
      res.json({
        message: 'Statistik perpustakaan berhasil diambil.',
        data: {
          total_books: stats.total_books,
          total_authors: stats.total_authors,
          total_categories: stats.total_categories,
          active_loans_borrowed: stats.active_loans
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ============================================================
  // TUGAS BARU: GET /api/loans/top-borrowers
  // Menampilkan 3 anggota yang paling sering meminjam buku
  // ============================================================
  async getTopBorrowers(req, res) {
    try {
      const topBorrowers = await LoanModel.getTopBorrowers();
      res.json({
        success: true,
        message: 'Top 3 Peminjam berhasil diambil.',
        data: topBorrowers
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }
};
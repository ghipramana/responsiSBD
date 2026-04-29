import express from 'express';
import { LoanController } from '../controllers/loanController.js';
// Import controller lain jika ada, contoh:
// import { BookController } from '../controllers/bookController.js';

const router = express.Router();

// ============================================================
// RUTE UNTUK PEMINJAMAN (LOANS)
// ============================================================

// TUGAS BARU: Top 3 Peminjam (Taruh di atas agar tidak dianggap sebagai :id)
router.get('/loans/top-borrowers', LoanController.getTopBorrowers);

// Statistik Perpustakaan
router.get('/reports/stats', LoanController.getStats);

// Daftar semua peminjaman
router.get('/loans', LoanController.getLoans);

// Detail peminjaman berdasarkan ID
router.get('/loans/:id', LoanController.getLoanById);

// Tambah peminjaman baru
router.post('/loans', LoanController.createLoan);

// Pengembalian buku (Gunakan POST atau PATCH sesuai instruksi tugasmu)
router.post('/loans/return/:id', LoanController.returnBook);


export default router;
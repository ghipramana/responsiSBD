import { pool } from '../config/db.js';

export const LoanModel = {
  // CREATE LOAN (dengan transaction)
  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Cek ketersediaan buku
      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (!bookCheck.rows[0]) {
        throw new Error('Buku tidak ditemukan.');
      }
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }

      // 2. Kurangi stok buku
      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

      // 3. Catat transaksi peminjaman
      const loanQuery = `
        INSERT INTO loans (book_id, member_id, due_date)
        VALUES ($1, $2, $3) RETURNING *
      `;
      const result = await client.query(loanQuery, [book_id, member_id, due_date]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // GET ALL LOANS
  async getAllLoans() {
    const query = `
      SELECT l.*, b.title AS book_title, m.full_name AS member_name
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      ORDER BY l.loan_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // GET LOAN BY ID
  async getById(id) {
    const query = `
      SELECT l.*, b.title AS book_title, m.full_name AS member_name
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      WHERE l.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // ============================================================
  // TUGAS 3: RETURN LOGIC - Pengembalian Buku
  // ============================================================
  async returnBook(loanId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const loanResult = await client.query(
        'SELECT * FROM loans WHERE id = $1',
        [loanId]
      );

      if (!loanResult.rows[0]) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }

      const loan = loanResult.rows[0];

      if (loan.status === 'RETURNED') {
        throw new Error('Buku ini sudah dikembalikan sebelumnya.');
      }

      const updatedLoan = await client.query(
        `UPDATE loans
         SET status = 'RETURNED', return_date = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [loanId]
      );

      const updatedBook = await client.query(
        `UPDATE books
         SET available_copies = available_copies + 1
         WHERE id = $1 RETURNING id, title, available_copies, total_copies`,
        [loan.book_id]
      );

      if (!updatedBook.rows[0]) {
        throw new Error('Gagal memperbarui stok buku.');
      }

      await client.query('COMMIT');

      return {
        loan: updatedLoan.rows[0],
        book: updatedBook.rows[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // ============================================================
  // TUGAS 4: STATISTIK PERPUSTAKAAN
  // ============================================================
  async getStats() {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM books)::INTEGER             AS total_books,
        (SELECT COUNT(*) FROM authors)::INTEGER           AS total_authors,
        (SELECT COUNT(*) FROM categories)::INTEGER        AS total_categories,
        (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED')::INTEGER AS active_loans
    `);
    return result.rows[0]; 
  },

  // ============================================================
  // TUGAS BARU: TOP 3 PEMINJAM
  // ============================================================
  async getTopBorrowers() {
    const query = `
      SELECT 
        m.*, 
        COUNT(l.id)::INTEGER AS total_pinjaman,
        MAX(l.loan_date) AS pinjaman_terakhir,
        (
          SELECT b.title 
          FROM loans l2
          JOIN books b ON l2.book_id = b.id
          WHERE l2.member_id = m.id
          GROUP BY b.title
          ORDER BY COUNT(l2.id) DESC, b.title ASC
          LIMIT 1
        ) AS buku_favorit
      FROM members m
      JOIN loans l ON m.id = l.member_id
      GROUP BY m.id
      ORDER BY total_pinjaman DESC
      LIMIT 3;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
};
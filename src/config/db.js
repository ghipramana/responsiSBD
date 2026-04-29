import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Tambahkan 'export' langsung di depan const
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tambahkan log ini buat mastiin di terminal kalau beneran konek
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Koneksi Neon Gagal:', err.message);
  } else {
    console.log('✅ Koneksi Neon Berhasil! Jam Server:', res.rows[0].now);
  }
});
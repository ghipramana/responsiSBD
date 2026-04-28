import { neon } from "@neondatabase/serverless";

const db = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const queryResult = await db`
      WITH borrower_totals AS (
        SELECT
          u.user_id,
          u.user_name,
          u.user_email,
          u.phone_number,
          u.category,
          COUNT(r.record_id) AS total_borrowed,
          MAX(r.borrowed_at) AS latest_borrow_date
        FROM library_users u
        JOIN borrow_records r ON u.user_id = r.user_id
        GROUP BY u.user_id, u.user_name, u.user_email, u.phone_number, u.category
      ),
      book_ranking AS (
        SELECT
          r.user_id,
          c.book_title,
          COUNT(*) AS borrow_count,
          ROW_NUMBER() OVER (
            PARTITION BY r.user_id
            ORDER BY COUNT(*) DESC, c.book_title ASC
          ) AS rank_number
        FROM borrow_records r
        JOIN book_catalog c ON r.book_id = c.book_id
        GROUP BY r.user_id, c.book_title
      )
      SELECT
        bt.user_id,
        bt.user_name,
        bt.user_email,
        bt.phone_number,
        bt.category,
        bt.total_borrowed,
        bt.latest_borrow_date,
        br.book_title,
        br.borrow_count
      FROM borrower_totals bt
      JOIN book_ranking br ON bt.user_id = br.user_id
      WHERE br.rank_number = 1
      ORDER BY bt.total_borrowed DESC, bt.latest_borrow_date DESC
      LIMIT 3;
    `;

    const data = queryResult.map((item) => ({
      anggota: {
        id: item.user_id,
        nama: item.user_name,
        email: item.user_email,
        telepon: item.phone_number,
        kategori: item.category,
      },
      total_pinjaman: Number(item.total_borrowed),
      buku_favorit: {
        judul: item.book_title,
        jumlah_dipinjam: Number(item.borrow_count),
      },
      pinjaman_terakhir: item.latest_borrow_date,
    }));

    return Response.json({
      status: "berhasil",
      message: "Daftar Top 3 Peminjam berhasil ditampilkan",
      jumlah_data: data.length,
      data,
    });
  } catch (error) {
    return Response.json(
      {
        status: "gagal",
        message: "Data Top 3 Peminjam gagal ditampilkan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
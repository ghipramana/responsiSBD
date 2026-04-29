import { pool } from '../config/db.js';

export const AuthorModel = {
  // GET ALL atau SEARCH by name
  async getAll(name = null) {
    let query = 'SELECT * FROM authors';
    const params = [];

    if (name) {
      query += ' WHERE LOWER(name) LIKE $1';
      params.push(`%${name.toLowerCase()}%`);
    }

    query += ' ORDER BY name ASC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  // GET BY ID
  async getById(id) {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    return result.rows[0];
  },

  // CREATE
  async create(name, nationality) {
    const query = 'INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name, nationality]);
    return result.rows[0];
  },

  // UPDATE
  async update(id, name, nationality) {
    const query = `
      UPDATE authors SET name = $1, nationality = $2
      WHERE id = $3 RETURNING *
    `;
    const result = await pool.query(query, [name, nationality, id]);
    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    await pool.query('DELETE FROM authors WHERE id = $1', [id]);
    return { message: 'Penulis berhasil dihapus.' };
  }
};

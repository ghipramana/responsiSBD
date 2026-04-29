import { pool } from '../config/db.js';

export const CategoryModel = {
  // GET ALL atau SEARCH by name
  async getAll(name = null) {
    let query = 'SELECT * FROM categories';
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
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  },

  // CREATE
  async create(name) {
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  // UPDATE
  async update(id, name) {
    const query = 'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  },

  // DELETE
  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    return { message: 'Kategori berhasil dihapus.' };
  }
};

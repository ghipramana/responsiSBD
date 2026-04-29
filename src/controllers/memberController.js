import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
  // GET /api/members
  async getAllMembers(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/members/:id
  async getMemberById(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/members
  async registerMember(req, res) {
    try {
      const newMember = await MemberModel.create(req.body);
      res.status(201).json({
        message: 'Anggota berhasil didaftarkan!',
        data: newMember
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /api/members/:id
  async updateMember(req, res) {
    try {
      const member = await MemberModel.update(req.params.id, req.body);
      if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
      res.json({ message: 'Data anggota berhasil diperbarui.', data: member });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE /api/members/:id
  async deleteMember(req, res) {
    try {
      const existing = await MemberModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
      const result = await MemberModel.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

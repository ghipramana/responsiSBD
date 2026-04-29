import express from 'express';
import { MemberController } from '../controllers/memberController.js';

const router = express.Router();

router.get('/', MemberController.getAllMembers);         // GET /api/members
router.get('/:id', MemberController.getMemberById);     // GET /api/members/:id
router.post('/', MemberController.registerMember);      // POST /api/members
router.put('/:id', MemberController.updateMember);      // PUT /api/members/:id
router.delete('/:id', MemberController.deleteMember);   // DELETE /api/members/:id

export default router;

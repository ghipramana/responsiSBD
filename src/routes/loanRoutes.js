import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

router.get('/', LoanController.getLoans);                  // GET /api/loans
router.get('/:id', LoanController.getLoanById);            // GET /api/loans/:id
router.post('/', LoanController.createLoan);               // POST /api/loans
router.patch('/:id/return', LoanController.returnBook);    // PATCH /api/loans/:id/return (Tugas 3)

export default router;

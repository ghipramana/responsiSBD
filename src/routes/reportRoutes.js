import express from 'express';
import { LoanController } from '../controllers/loanController.js';

const router = express.Router();

// GET /api/reports/stats (Tugas 4)
router.get('/stats', LoanController.getStats);

export default router;

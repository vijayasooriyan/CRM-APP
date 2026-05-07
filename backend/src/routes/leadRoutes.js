const express = require('express');
const {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNoteToLead,
} = require('../controllers/leadController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All lead routes are protected
router.use(verifyToken);

// Lead CRUD routes
router.get('/', getAllLeads);
router.post('/', createLead);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// Note routes
router.post('/:id/notes', addNoteToLead);
router.post('/:id/summarize', require('../controllers/leadController').summarizeNotes);

module.exports = router;

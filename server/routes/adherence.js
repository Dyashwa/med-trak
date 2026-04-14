const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAdherenceLogs,
  createAdherenceLog,
  deleteAdherenceLog,
  getAdherenceSummary,
} = require('../controllers/adherenceController');

router.use(protect);

router.get('/summary', getAdherenceSummary);   // must be before /:id
router.get('/',        getAdherenceLogs);
router.post('/',       createAdherenceLog);
router.delete('/:id',  deleteAdherenceLog);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getEffectivenessLogs,
  createEffectivenessLog,
  deleteEffectivenessLog,
  getEffectivenessTrend,
} = require('../controllers/effectivenessController');

router.use(protect);

router.get('/trend', getEffectivenessTrend);   // must be before /:id
router.get('/',      getEffectivenessLogs);
router.post('/',     createEffectivenessLog);
router.delete('/:id', deleteEffectivenessLog);

module.exports = router;

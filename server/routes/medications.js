const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');

router.use(protect); // all medication routes require auth

router.get('/',     getMedications);
router.get('/:id',  getMedicationById);
router.post('/',    createMedication);
router.put('/:id',  updateMedication);
router.delete('/:id', deleteMedication);

module.exports = router;

const express = require('express');
const { addpatient, deletePatient, getPatientById, updatePatient } = require('./patientcontrolleur'); // Update import if needed
const router = express.Router();

// POST /api/patients
router.post('/add', addpatient);

// DELETE /api/patients/:id
router.delete('/:id', deletePatient);

// GET /api/patients/:id
router.get('/:id', getPatientById);

// PUT /api/patients/:id
router.put('/:id', updatePatient);

module.exports = router;

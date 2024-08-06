const patient = require('./model'); // Ensure this path is correct

// Add a new patient
const addpatient = async (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;
    try {
        await patient.create({
            firstName,
            lastName,
            email,
            phoneNumber
        });
        res.json({ msg: "Patient added" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error adding patient", error });
    }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPatient = await patient.findByIdAndDelete(id);
        if (!deletedPatient) {
            return res.status(404).json({ msg: "Patient not found" });
        }
        res.json({ msg: "Patient deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error deleting patient", error });
    }
};

// Get a patient by ID
const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patientData = await patient.findById(id);
        if (!patientData) {
            return res.status(404).json({ msg: "Patient not found" });
        }
        res.json(patientData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error retrieving patient", error });
    }
};

// Update a patient by ID
const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;
    try {
        const updatedPatient = await patient.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phoneNumber
        }, { new: true }); // `new: true` returns the updated document
        if (!updatedPatient) {
            return res.status(404).json({ msg: "Patient not found" });
        }
        res.json(updatedPatient);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error updating patient", error });
    }
};


module.exports = { addpatient, deletePatient, getPatientById, updatePatient };

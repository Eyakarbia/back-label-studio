const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    etablissment: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming etablissment references a User
});

module.exports = mongoose.model('patient', patientSchema);

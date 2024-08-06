// app/modules/user/model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
<<<<<<< HEAD
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
=======
    phone:{  type: String, required: true },
    addresse:{ type: String, required: true }
>>>>>>> 65191f289b54f2fbb1a8425424a029ca11568463
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};


module.exports = mongoose.model('User', userSchema);

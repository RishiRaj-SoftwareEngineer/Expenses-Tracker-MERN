const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
    fullName: { type: String, required: true },
    email   : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    },
    { timestamps: true }
);

// Hash password before saving the user
// Use async middleware without `next`; Mongoose handles the promise.
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

//Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
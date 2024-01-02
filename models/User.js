const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    firstName: {type: String, required: true},
    password: {type: String, required: true},
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods = {
    comparePassword: async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    },

    generateToken: function() {
        return jwt.sign(
            {
                _id: this._id,
                name: this.name
            },
            process.env.JWT_SECRET || 'defaultSecret',
            {
                expiresIn: '7d'
            }
        );
    },
}

const User = mongoose.model('User', userSchema);

module.exports = User;
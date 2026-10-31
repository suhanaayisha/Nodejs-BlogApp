const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'Please provide your username']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'Please provide your email']
    },
    password: {
        type: String,
        required: [true,'Please provide your password']
    }
    
})
UserSchema.pre('save', async function(){
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10)
})
const User = mongoose.model('User', UserSchema)

module.exports = User
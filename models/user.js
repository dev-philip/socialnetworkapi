const mongoose = require('mongoose');
const uuidv1 = require('uuidv1');
const { createHmac } = require('crypto');
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String,
        trim: true
    },
    following: [{type: ObjectId, ref: "User"}],
    followers: [{type: ObjectId, ref: "User"}],
    resetPasswordLink: {
        data: String,
        default: ""
    }

});

userSchema.virtual('password')
    .set(function(password) {
        //create temporary variable called _password
        this._password = password
            // generate a timestamp
        this.salt = uuidv1()
            //encrypt Password
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })

//methods to encrypt password
//how to add method to model
userSchema.method('encryptPassword', function(password) {
    if (!password) return "";
    try {
        return createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
    } catch (err) {
        return ""
    }
});

userSchema.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
});


module.exports = mongoose.model("User", userSchema);
//User is the name of the model
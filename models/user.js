const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new Schema({

    name:{
        type: String,
        minlength: [5, "Name must be of min 5 characters"],
        required: [true,'Please enter username']
    },

    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please enter an email'],
        validate: [isEmail, 'Please enter a valid email']
    },

    password:{
        type: String,
        minlength: [6, 'Password must be of min 6 characters'],
        required:  [true , 'Please enter a password']
    }

},{timestamps: true})

userSchema.pre('save', async function(next) {
    
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

userSchema.statics.loginUser = async function(email,password){

    const user = await User.findOne({email});
    if(user){

        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect mail id');
}

const User = mongoose.model("user",userSchema);

module.exports = User;


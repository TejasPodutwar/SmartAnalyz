const User = require("../models/user");
const jwt = require('jsonwebtoken');


const handleErrors = (err) =>{

    let error = { name:'', email:'', password:'' }

    if(err.message.includes('Incorrect mail id')){
        error['email'] = 'Incorrect mail id';
    }

    if(err.message.includes('Incorrect Password')){
        error['password'] = 'Incorrect Password';
    }

    if(err.code == 11000){
        error.email = 'Email Already Registered';
        return error;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach( ({properties}) =>{
            error[properties.path] = properties.message;
        });
    }

    return error;
}

const maxTime = 5*60;
const createToken = (id) =>{

    return jwt.sign({id},process.env.secretString,{
        expiresIn: maxTime
    })
}

module.exports.login_user = (req,res) => {
    res.render("login",{ title: "Login"});
};

module.exports.signup_user = (req,res) => {
    res.render("register",{ title: "SignUp"});
};

//POST new user
module.exports.create_user = async (req,res) => {
    
    const data = req.body;  

    const newUser = new User(data);

    try {
        const result = await newUser.save();
        const token = createToken(result._id);
        res.cookie('jwt',token,{maxAge: maxTime*1000});
        res.status(200).send({user:'Signup successful!'}); 
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({errors});
    }
};

//Login a user
module.exports.get_user = async (req,res) =>{

    const {email,password} = req.body;

    try {
        
        const user = await User.loginUser(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{maxAge: maxTime*1000});
        res.status(200).send({user:'Login successful!'});

    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({errors});
    }

} 

//logout the user
module.exports.logout_user = async (req,res) =>{
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
}
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkUser = (req,res,next) =>{


    console.log(req.cookies); 
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,'stockVisualizerSPM', async (err,decodedToken) =>{
            if(err){
                res.locals.user = null;
                next();
            }
            else{
                let user = await User.findById(decodedToken.id.trim());
                res.locals.user = user;
                next();
            }
        });   
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = checkUser;
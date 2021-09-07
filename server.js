const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

//express app initialization
const app = express();
dotenv.config({path: 'config.env'});
const PORT = process.env.PORT || 3000;


const DB_URL = process.env.DB_URI;
mongoose.connect(DB_URL,{useNewUrlParser: true, useUnifiedTopology: true})
.then((result) =>{
    console.log("Connection to the database successful...");
})
.catch((err) => {
    console.log("Unable to connect to the db...");
})

//setting ejs as the view engine
app.set("view engine",'ejs');

//logger for the requests
app.use(morgan("dev"));

app.use(express.static("./assets/css"));
app.use(express.static("./assets/img"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get('/', (req,res)=>{
    res.sendFile('./index.html', { root: __dirname });
});

app.get('/home', (req,res)=>{
    res.sendFile('./home.html', { root: __dirname });
})

app.use('/auth', authRoutes);




app.listen(PORT, () =>{
    console.log("Server is up and running...");
    console.log(`Visit http://localhost:${PORT}`);
});
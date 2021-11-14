const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const checkUser = require('./middleware/checkUser');
const axios = require('axios');
const schedule = require('node-schedule');
const NewsArticle = require('./models/newsArticle');
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

// logger for the requests
app.use(morgan("dev"));

//Updates News after every 15mins
schedule.scheduleJob('*/15 * * * *',async ()=>{
    try{
        var url = 'https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=b49c8b0558814c1ebcfa2b3360612d1e';
        const response = await axios.get(url);
        const articles = response.data.articles.slice(0,12);

        let count =1;
        articles.forEach(async article =>{

            const {author, title, content, url, urlToImage, publishedAt} = article;
            const newsArticle = new NewsArticle({
                author, title, content, url, urlToImage, publishedAt
            })
            const result = await newsArticle.save();
        })

    }
    catch(err){
        console.log(err.message);
    }
})

app.use(express.static("./assets/css"));
app.use(express.static("./assets/img"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get('/', (req,res)=>{
    res.sendFile('./index.html', { root: __dirname });
});

app.get('/home', checkUser,(req,res)=>{
    res.sendFile('./home.html', { root: __dirname });
})


app.use('/auth', authRoutes);


app.listen(PORT, () =>{
    console.log("Server is up and running...");
    console.log(`Visit http://localhost:${PORT}`);
});
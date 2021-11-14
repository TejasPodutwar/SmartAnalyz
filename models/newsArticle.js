const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    author: String,
    title: String,
    content: String,
    url: String,
    urlToImage: String,
    publishedAt: Date
},{timestamps: true});

const NewsArticle = mongoose.model("news",newsSchema);

module.exports = NewsArticle;
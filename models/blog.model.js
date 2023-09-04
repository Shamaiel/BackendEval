const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {  type :String,  required: true},
    content: {  type :String,  required: true},
    author: {  type :String,  required: true},
    category: {  type :String,  required: true},
    image: {  type :String },
    user_id : {type : String, required : true}
   
})

 const BlogModel =  mongoose.model("Blog", blogSchema);

 module.exports = {
     BlogModel
 }






const express = require("express")
const jwt = require("jsonwebtoken")
// const bcrypt = require('bcrypt');
require("dotenv").config()
const cors = require("cors");
const { connection } = require("./config/db");
const { UserModel } = require("./models/user.model");
const { authenticaTion } = require("./middleware/auth.middleware");
const { BlogModel } = require("./models/blog.model");
const bcrypt = require('bcryptjs');


const PORT = process.env.PORT

const app = express()

app.use(express.json())

app.use(cors(
    {
      origin : "*"
   }
))



/////SIGN  UP  
app.post("/signup", async (req, res) => {


    const {email, password, name}=req.body

    const isUser = await UserModel.findOne( {email : email} )
    
    if(isUser){
        res.send({msg : " Email is Registered alreday ! try signing In "})
    }

    bcrypt.hash(password, 5, async function(err, hash) {

        const newUser = new UserModel({
            
            email,
            name,
            password : hash
           
        })
        await newUser.save()

        res.send( {msg: "Sign up succeful"} )
    });
})




///LOGIN
app.post("/login", async (req, res) => {


    const { email, password } = req.body

    const isUser = await UserModel.findOne( { email } )
    
    if( isUser ){
        
        const hashedPasswrd = isUser.password

        bcrypt.compare(password, hashedPasswrd, function(err, result) {
           
            if(result){
               
                const token = jwt.sign({userID : isUser._id},  process.env.SECRET_KEY)
                res.send({ msg : "Login Successfull", token : token})
            }
            else{
                res.send("Login failed")
            }
        })
    }
    else{
        res.send("Sign up first")
    }
})



//here this authentication would authenticate below endpoints
app.use( authenticaTion )


//GET ALL blogssssssss
app.get("/blogs", async (req, res) => {
   
    try{
        const blogs = await BlogModel.find( {user_id : req.userID } )
        res.send({blogs})
    }
    catch(err){
       
        console.log(err)
        res.send({msg : "SOMEething went wrong,.. Please Try again later"})
    }
})


app.post("/blogs/add" ,  async (req, res) => {
   
    const {title, author, content, image, category} = req.body

    const userID = req.userID
    
    const new_blog = new  BlogModel(
       
        {
        title,
        content,
        author,
        category,
        image,
        user_id : userID

        })

    try{ 
        await new_blog.save()

        return res.send({msg : "blog  added successfully "})
    }

    catch(err){

        console.log(err)

        res.send({msg : "something is wrong"})

    }
})


//delete blog
app.delete("/blogs/:blogID", async (req, res) => {

    const {blogsID} = req.params

    try{
        // console.log(req)
        const blogs = await BlogModel.findOneAndDelete({_id : taskID,  user_id : req.userID})

        if( blogs ){
            res.send({msg : "Blog deleted sucCessfully"})
        }

        else{
            res.send({msg : "Task not found!!! or You are not Authorised"})
        }
    }
    catch(err){
        console.log(err)
        res.send({msg : "something went wrong, please try again later"})
    }
})


///updateeee operation
app.put("/blogs/:blogID", async (req, res) => {
    try {
        const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.blogID, req.body, {
            new: true
        });

        if (!updatedBlog) {
            return res.status(404).send({ msg: "Blog not found" });
        }

        // Save the updated blog
        await updatedBlog.save();

        res.status(200).send(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "An error occurred while updating the blog" });
    }
});






app.listen(PORT, async () => {
    try{
        await connection
        console.log("connected to db successfully")
    }
    catch(err){
        console.log("error while connecting to DB")
        console.log(err)
    }
    console.log("listening on port 8080")
})












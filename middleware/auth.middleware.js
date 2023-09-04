
const jwt = require("jsonwebtoken")
require("dotenv").config()


const authenticaTion = (req, res, next) => {

    const token= req.headers.authorization?.split(" ")[1]

    if(!token){

        return   res.send({Msg : "Login first "})
    }

    jwt.verify( token, process.env.SECRET_KEY, (error, decoded) => {
      
        if(error){
            return res.send( { msg : "Login first"} )
        }

        else{
            
            console.log(decoded)
            const {userID} = decoded
           
            req.userID = userID;
            
            next()
        }
    })
}

module.exports = {
    
    authenticaTion

}




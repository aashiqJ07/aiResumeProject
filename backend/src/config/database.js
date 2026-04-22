const mongoose = require('mongoose');

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connection successfully")
    }
    catch(error){
        console.log(error)
    
    }
}

module.exports = connectToDB;
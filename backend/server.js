require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const invokeGeminiAi = require("./services/ai.service")



connectToDB()


app.listen(3000,() =>{
    console.log("server running on port 3000")
})
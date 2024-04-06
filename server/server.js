require("dotenv").config()
const path=require('path')
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/dbConn")
const corsOptions = require("./config/corsOptions")
const mongoose = require("mongoose")
const app = express()
const PORT = process.env.PORT || 1234
connectDB()
app.use(express.json())
app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("this is home page")
})
app.use(express.static("public"))

app.get('/uploads/:filename', (req, res) => {
    const imagePath = path.join(__dirname, '/public/uploads/', req.params.filename);
    res.sendFile(imagePath, { headers: { 'Content-Type': 'image/jpeg' } });
});
app.use('/uploads', express.static(__dirname + '/public/uploads'));


app.use("/api/auth", require("./routers/auth")) 
app.use("/api/user", require("./routers/user"))
app.use("/api/article", require("./routers/article"))
app.use("/api/commonQuestion", require("./routers/commonQuestion"))
app.use("/api/massage", require("./routers/massage"))
app.use("/api/product", require("./routers/product"))
app.use("/api/recommendation", require("./routers/recommendation"))
app.use("/api/order", require("./routers/order"))


mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    }) 
})

mongoose.connection.on('error', err => { console.log(err) })

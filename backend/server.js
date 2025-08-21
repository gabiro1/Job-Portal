require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const jobRoutes = require("./routes/jobRoutes")
const applicationsRoutes = require("./routes/applicationRoutes")
const savedJobRoutes = require("./routes/savedJobRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")

const app = express();

// middleware to handle cors 

app.use(
    cors({
        origin: "*",
        methods: ["GET","POST","PUT","DELETE"],
            allowedHeaders:["Content-Type", "Authorization"],
    })
);

// connect database 
connectDB();

// middleware 

app.use(express.json());

// routes 
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationsRoutes)
app.use("/api/saved-job", savedJobRoutes)
app.use("/api/analytics", analyticsRoutes)

// server uploads folder
app.use("/uploads", express.static(path.join(__dirname,"uploads"), {}));

// start server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server is running on port http://localhost:${PORT}`)
})
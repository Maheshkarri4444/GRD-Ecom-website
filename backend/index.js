require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const userRoutes = require("./routes/userRoutes")

app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the origin of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

Port = process.env.PORT

app.use("/api",userRoutes)

database().then(
    app.listen(process.env.PORT, () => {
      console.log("server is running on the port: ",Port);
    })
  );
  

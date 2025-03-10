require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");

const userRoutes = require("./routes/userRoutes")
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const bannerRoutes = require("./routes/bannerRoutes")
const blobRoutes = require("./routes/blobRoutes");
const orderRoutes =require("./routes/orderRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const chatRoutes = require("./routes/chat");
const promotionRoutes = require("./routes/promotionRoutes");

app.use(cors());
app.use(cors({
  origin: 'https://grdnaturals.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

Port = process.env.PORT

app.use("/api",userRoutes)
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/promotion",promotionRoutes)

app.use("/api/admin/category",categoryRoutes)
app.use("/api/admin/product",productRoutes);
app.use("/api/admin/banner",bannerRoutes);
app.use("/api/admin/blob",blobRoutes);
app.use("/api/admin/analysis",analysisRoutes);

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});



database().then(
    app.listen(process.env.PORT, () => {
      console.log("server is running on the port: ",Port);
    })
  );
  

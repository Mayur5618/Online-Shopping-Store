import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import productsRouter from "./routes/products.route.js";
import cookieParser from "cookie-parser";
import commentRouter from "./routes/comment.route.js";
import cartRouter from "./routes/cart.route.js";
import path from "path";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.db)
  .then(() => console.log("database is connected.."))
  .catch((err) => console.log(err));

const __dirname = path.resolve();

app.listen(3000, () => {
  console.log("Server is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productsRouter);
app.use("/api/comment", commentRouter);
app.use("/api/cart", cartRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); 
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

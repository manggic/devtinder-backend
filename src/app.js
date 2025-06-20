const express = require("express");

const cookieParser = require("cookie-parser");
const connectToDB = require("./config/database");
const userRouter = require("./routes/userRoutes");
const profileRouter = require("./routes/profileRoutes");
const authRouter = require("./routes/authRoutes");
const requestRouter = require("./routes/requestRoutes");
const cors = require("cors");

const app = express();

let PORT = 4000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
app.use(cookieParser());

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

app.get("/test", (req, res) => {
  res.json({
    message: "success",
  });
});
connectToDB()
  .then((res) => {
    console.log("MONGO_DB CONNECTED SUCCESSFULLY");
    app.listen(PORT, () => {
      console.log(`Server is runinng at PORT - ${PORT}`);
    });
  })
  .catch((ERR) => console.log("MONGO CONNECTION ERROR"));



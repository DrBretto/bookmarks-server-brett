require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const morganOption = NODE_ENV === "production" ? "tiny" : "common";
const validateBearerToken = require("./validateBearerToken");
const errorHandler = require("./errorHandler");
const bookmarkRouter = require("./bookmark-router");

const app = express();

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(validateBearerToken);

app.use(bookmarkRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

module.exports = app;

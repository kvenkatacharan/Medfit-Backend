"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");
const studentRoutes = require("./routes/student-routes");
const userRoutes = require("./routes/user-routes");
const specialtyRoutes = require("./routes/specialty-routes");
const availableSlotsRoutes = require("./routes/slots-routes");
const zoomMeetingRouter = require("./routes/zoom-routes");
const RazorpayRouter = require("./routes/razor-pay-routes");
const fileUploadRouter = require("./routes/file-upload-routes");
const reportsRouter = require("./routes/reports-routes");
const morgan = require("morgan");
const dotenv = require("dotenv");
const app = express();
const isAuthenticated = require("./auth/authenticated");
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/files", express.static(path.join(__dirname, "files")));

app.use((req, res, next) => {
  res.setHeader("Last-Modified", new Date().toUTCString());
  req.headers["if-none-match"] = "no-match-for-this";
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  let split_num = req.url.split("/")[3] === "api" ? 5 : 3;
  if (
    req.url.split("/")[split_num] === "files" ||
    req.url.split("/")[split_num] === "user" ||
    req.url.split("/")[split_num] === "auth" ||
    req.url.split("/")[split_num] === "specialty" ||
    req.url.split("/")[split_num] === "zoom" ||
    req.url.split("/")[split_num + 1] === "getSlots"
  ) {
    next();
  } else if (req.headers.authorization) {
    isAuthenticated(req, res, next);
  } else {
    res.status(401).json("Unautorized");
  }
});
// const router = express.Router();

// this.app.use('/', router);'=
const version = "/api/v1";
app.use(version + "/student", studentRoutes.routes);
app.use(version + "/user", userRoutes.routes);
app.use(version + "/specialty", specialtyRoutes.routes);
app.use(version + "/slots", availableSlotsRoutes.routes);
app.use(version + "/zoom", zoomMeetingRouter.routes);
app.use(version + "/razorpay", RazorpayRouter.routes);
app.use(version + "/fileupload", fileUploadRouter.routes);
app.use(version + "/reports", reportsRouter.routes);
app.listen(config.port, () =>
  console.log("App is  listening on Url http://localhost" + config.port)
);

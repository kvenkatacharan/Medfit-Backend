const express = require("express");
const {
  signUp,
  signIn,
  generateToken,
  addUser,
  signOut,
  updateUser,
  getUsersWithCondition,
  updateConsultancyFee,
} = require("../controllers/userController");
const { isAuthorized } = require("../auth/authorized");
const router = express.Router();

router.post("/signIn", signIn);

router.post("/signUp", signUp);

router.post("/signOut", signOut);

router.post("/add", addUser);
router.post("/update", updateUser);
router.post("/getUsersWithCondition", getUsersWithCondition);

router.post("/updateConsultancyFee", updateConsultancyFee);
module.exports = {
  routes: router,
};

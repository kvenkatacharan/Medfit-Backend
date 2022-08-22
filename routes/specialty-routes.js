const express = require("express");
const {
  //    addStudent,
  //    getAllStudents,
  getSpecialty,
  updatespecialty,
  getAllSpecialties,
  //    updateStudent,
  //    deleteStudent
} = require("../controllers/specilatyController");
const { isAuthorized } = require("../auth/authorized");

const router = express.Router();
// router.post('/', addStudent);
router.get("/", getAllSpecialties);
router.get("/:id", getSpecialty);
router.put("/:id", updatespecialty);
// router.delete('/:id', deleteStudent);

module.exports = {
  routes: router,
};

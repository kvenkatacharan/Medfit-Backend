"use strict";

const { firebase, admin } = require("../db");
const Student = require("../models/student");
const firestore = firebase.firestore();

const addStudent = async (req, res, next) => {
  try {
    const data = req.body;

    await firestore.collection("SpecialtyData").doc().set(data);
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await firestore.collection("students");
    const data = await students.get();
    const studentsArray = [];
    if (data.empty) {
      res.status(404).send("No student record found");
    } else {
      data.forEach((doc) => {
        const student = new Student(
          doc.id,
          doc.data().firstName,
          doc.data().lastName,
          doc.data().fatherName,
          doc.data().class,
          doc.data().age
          // doc.data().phoneNumber,
          // doc.data().subject,
          // doc.data().year,
          // doc.data().semester,
          // doc.data().status
        );
        studentsArray.push(student);
      });
      res.send(studentsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const Users = await firestore.collection("users");
    let query = Users;
    query = query.where("role", "==", "doctor");
    let querySnapshot = await query.get();
    const docData = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    const AvailableSlots = await firestore.collection("AvailableSlots");
    let availableSlotsQuery = AvailableSlots;
    availableSlotsQuery = availableSlotsQuery.where(
      "fullDate",
      "in",
      getNextSevenDays()
    );

    availableSlotsQuery.get().then((availableSlotsQuerySnapshot) => {
      const slotsdata = availableSlotsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.send({ docData, slotsdata });
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    firestore
      .collection("SpecialtyData")
      .doc(id)
      .set(data)
      .then(() => {
        res.send("successfully signed up");
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection("students").doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};

function getNextSevenDays() {
  var aryDates = [];
  var daysToAdd = 6;
  var startDate = new Date();
  for (var i = 0; i <= daysToAdd; i++) {
    var currentDate = new Date();
    currentDate.setDate(startDate.getDate() + i);
    var fullDate =
      DayAsString(currentDate.getDay()) +
      ", " +
      currentDate.getDate() +
      " " +
      MonthAsString(currentDate.getMonth()) +
      " " +
      currentDate.getFullYear();
    var dayName = DayAsString(currentDate.getDay());
    var day =
      currentDate.getDate() < 10
        ? "0" + currentDate.getDate()
        : "" + currentDate.getDate();
    // var datObj = { fullDate, dayName, day };
    aryDates.push(fullDate);
  }

  return aryDates;
}

function MonthAsString(monthIndex) {
  var d = new Date();
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  return month[monthIndex];
}

function DayAsString(dayIndex) {
  var weekdays = new Array(7);
  weekdays[0] = "Sun";
  weekdays[1] = "Mon";
  weekdays[2] = "Tue";
  weekdays[3] = "Wed";
  weekdays[4] = "Thu";
  weekdays[5] = "Fri";
  weekdays[6] = "Sat";

  return weekdays[dayIndex];
}

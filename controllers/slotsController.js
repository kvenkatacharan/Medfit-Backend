"use strict";

const { firebase, admin } = require("../db");
const { sortByTime } = require("../helpers/helper");

const {
  sendBookingConfirmationMail,
  sendPrescriptionMail,
} = require("./emailController");
const { createZoomMeetinglink } = require("./zoomController");

const firestore = firebase.firestore();

const addAvailableSlots = async (req, res, next) => {
  try {
    const data = req.body;
    var batch = firestore.batch();

    data.forEach((doc) => {
      // console.log(doc);
      // console.log(doc?.id && doc?.id?.length > 0);
      if (doc?.id && doc?.id?.length > 0) {
        // console.log("hi in if");
        batch.set(firestore.collection("AvailableSlots").doc(doc.id), doc);
      } else {
        // console.log("hi in else");
        batch.set(firestore.collection("AvailableSlots").doc(), doc);
      }
    });
    batch.commit().then(function () {
      res.send("Record saved successfuly");
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllAvailableSlots = async (req, res, next) => {
  try {
    const AvailableSlots = await firestore.collection("AvailableSlots");
    const data = await AvailableSlots.get();
    const AvailableSlotsArray = [];
    if (data.empty) {
      res.status(404).send("No AvailableSlots record found");
    } else {
      data.forEach((doc) => {
        //   const AvailableSlots = {
        //       doc.id,
        //       doc.data().firstName,
        //       doc.data().lastName,
        //       doc.data().fatherName,
        //       doc.data().class,
        //       doc.data().age
        //   }
        AvailableSlotsArray.push(AvailableSlots);
      });
      res.send(AvailableSlotsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAvailableSlots = async (req, res, next) => {
  try {
    const AvailableSlots = await firestore.collection("AvailableSlots");
    let query = AvailableSlots;
    let reqBody = req.body ? req.body : {};
    let keys = Object.keys(reqBody);
    if (keys.length > 0) {
      keys.forEach((key) => {
        // console.log(key, "==", reqBody[key]);
        query = query.where(key, "==", reqBody[key]);
      });
    }

    query.get().then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.send(data);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateAvailableSlots = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    firestore
      .collection("AvailableSlots")
      .doc(id)
      .set(data)
      .then(() => {
        res.send("successfully updated");
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addBooking = async (req, res, next) => {
  try {
    console.log("in add booking");
    const data = req.body;
    // console.log(data);
    // updateAvailableSlots;
    //

    firestore
      .collection("AvailableSlots")
      .doc(data.slot.id)
      .set(data.slot)
      .then(() => {
        let slot = data.slot;
        (slot.slotId = slot.id), delete slot.id;
        let bookingData = {
          ...slot,
          patientId: data.patientId,
          consultancyFee: data.consultancyFee,
          prescribtion: data.prescribtion,
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          doctorName: data.doctorName,
          doctorEmail: data.doctor.email,
          status: "booked",
          paymentInfo: data.paymentInfo,
        };

        createZoomMeetinglink({ mail: "appmedfit@gmail.com" })
          .then((response) => {
            bookingData.zoomUrl = response.join_url;
            console.log("zoom url createdd", bookingData.zoomUrl);
            firestore
              .collection("bookings")
              .doc()
              .set(bookingData)
              .then(() => {
                console.log("booking ok");
                sendBookingConfirmationMail({
                  patientName: data.patientName,
                  patientEmail: data.patientEmail,
                  doctorName: data.doctorName,
                  fullDate: slot.fullDate + " " + slot.detailText,
                  zoomUrl: response.join_url,
                })
                  .then((inf) => {
                    console.log("info", inf);
                    res.send("Slot Booked Successfully");
                  })
                  .catch((error) => {
                    console.log("err in sendi", error);
                    res.status(400).send(error);
                  });
              })
              .catch((error) => {
                res.status(400).send(error.message);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const AvailableSlots = await firestore.collection("bookings");
    let query = AvailableSlots;
    let reqBody = req.body ? req.body : {};
    let keys = Object.keys(reqBody);
    if (keys.length > 0) {
      keys.forEach((key) => {
        query = query.where(key, "==", reqBody[key]);
      });
    }

    query.get().then((querySnapshot) => {
      let data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(data[5]);
      data = data.sort((slot1, slot2) => {
        return sortByTime(slot1.SlotDateTime, slot2.SlotDateTime);
      });
      // console.log(data[5]);
      res.send(data);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const updateBooking = async (req, res, next) => {
  try {
    const id = req.body.id;
    const data = req.body;
    // console.log(data);
    firestore
      .collection("bookings")
      .doc(id)
      .update(data)
      .then(() => {
        if (data.prescriptionStatus && data.prescriptionStatus == "completed") {
          console.log("updaatexwx");
          sendPrescriptionMail({
            patientName: data.patientName,
            patientEmail: data.patientEmail,
            doctorName: data.doctorName,
            fullDate: data.fullDate + " " + data.detailText,
          })
            .then((inf) => {
              console.log("info", inf);
              res.send("successfully updated");
            })
            .catch((error) => {
              console.log("err1", error);
              res.status(400).send(error);
            });
        } else {
          res.send("successfully updated");
        }
      })
      .catch((error) => {
        console.log("err2", error);
        res.status(400).send(error.message);
      });
  } catch (error) {
    console.log("err3", error);
    res.status(400).send(error.message);
  }
};
const deleteAvailableSlots = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection("AvailableSlots").doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const nextSevenDaysSlots = async (req, res, next) => {
  try {
    const AvailableSlots = await firestore.collection("AvailableSlots");
    let availableSlotsQuery = AvailableSlots;
    availableSlotsQuery = availableSlotsQuery
      .where("doctorId", "==", req.body.doctorId)
      .where("fullDate", "in", getNextSevenDays());

    availableSlotsQuery.get().then((availableSlotsQuerySnapshot) => {
      const slotsdata = availableSlotsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.send(slotsdata);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
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

module.exports = {
  addAvailableSlots,
  getAllAvailableSlots,
  getAvailableSlots,
  updateAvailableSlots,
  deleteAvailableSlots,
  addBooking,
  getBooking,
  updateBooking,
  nextSevenDaysSlots,
};

"use strict";

const { firebase, admin } = require("../db");
const firestore = firebase.firestore();

// const addSpecialty = async (req, res, next) => {

//     try {
//         const data = req.body;

//         await firestore.collection('SpecialtyData').doc().set(data);
//         res.send('Record saved successfuly');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

// const getAllspecialtys = async (req, res, next) => {

//     try {
//         const specialtys = await firestore.collection('specialtys');
//         const data = await specialtys.get();
//         const specialtysArray = [];
//         if(data.empty) {
//             res.status(404).send('No specialty record found');
//         }else {
//             data.forEach(doc => {
//                 const specialty = new specialty(
//                     doc.id,
//                     doc.data().firstName,
//                     doc.data().lastName,
//                     doc.data().fatherName,
//                     doc.data().class,
//                     doc.data().age,
//                     // doc.data().phoneNumber,
//                     // doc.data().subject,
//                     // doc.data().year,
//                     // doc.data().semester,
//                     // doc.data().status
//                 );
//                 specialtysArray.push(specialty);
//             });
//             res.send(specialtysArray);
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

const getSpecialty = async (req, res, next) => {
  try {
    const id = req.params.id;
    const specialty = await firestore.collection("SpecialtyData").doc(id);
    const data = await specialty.get();
    if (!data.exists) {
      res.status(200).send("specialty with the given ID not found");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllSpecialties = async (req, res, next) => {
  try {
    const AvailableSlots = await firestore.collection("SpecialtyData");
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
      res.send(data);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatespecialty = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    firestore
      .collection("SpecialtyData")
      .doc(id)
      .set(data)
      .then(() => {
        res.send("updated");
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// const deletespecialty = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         await firestore.collection('SpecialtyData').doc(id).delete();
//         res.send('Record deleted successfuly');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

module.exports = {
  getSpecialty,
  updatespecialty,
  getAllSpecialties,
};

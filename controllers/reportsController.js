const config = require("../config");

const { firebase, admin } = require("../db");
const firestore = firebase.firestore();
const addReports = async (req, res, next) => {
  try {
    const collection = "reports";
    let data = { ...req.body, isAdminViewed: false };
    firestore
      .collection(collection)
      .doc()
      .set(data)
      .then(() => {
        res.send({ data: "successfully added" });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
    // ...
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const updateReports = async (req, res, next) => {
  try {
    const collection = "reports";
    let data = { ...req.body };
    firestore
      .collection(collection)
      .doc(data.id)
      .update(data)
      .then(() => {
        res.send({ data: "updated" });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
    // ...
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const getReports = async (req, res, next) => {
  try {
    const reports = await firestore.collection("reports");
    let query = reports;
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

module.exports = {
  addReports,
  getReports,
  updateReports,
};

"use strict";

const { request } = require("express");
const { firebase, admin } = require("../db");
const firestore = firebase.firestore();

const generateToken = async (req, res, next) => {
  try {
    firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        const id = user.uid;

        let newUser = { token: idToken, id: id };
        getUser(req, res, newUser);
      })
      .catch(function (error) {
        // Handle error
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signUp = async (req, res, next) => {
  try {
    const {
      email,
      password,
      role,
      name,
      consultancyFee,
      degree,
      experience,
      registrationNumber,
      specialty,
      location,
    } = req.body;
    const extraCols = {
      gender: "",
      phone: "",
      dob: "",
      workEmail: "",
    };
    const collection = "users";
    // console.log(request.body);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        let data =
          role == "user"
            ? {
                email,
                role,
                name,
                id: user.uid,
                ...extraCols,
                verificationStatus: "verified",
              }
            : {
                email,
                id: user.uid,
                role,
                name,
                consultancyFee,
                degree,
                experience,
                registrationNumber,
                specialty,
                location,
                verificationStatus: "pending",
                ...extraCols,
              };
        // console.log(data);
        firestore
          .collection(collection)
          .doc(user.uid)
          .set(data)
          .then(() => {
            res.send({ data: "successfully signed up" });
          })
          .catch((error) => {
            res.status(400).send(error.message);
          });
        // ...
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addUser = async (req, res, next) => {
  try {
    const { email, uid, role, name } = req.body;

    const collection = "users";
    console.log(req.body);
    let data = { ...req.body };

    console.log("data", data);
    firestore
      .collection(collection)
      .doc(uid)
      .set(data)
      .then(() => {
        res.send({ data: "successfully signed up" });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
    // ...
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.body;

    const collection = "users";
    let data = { ...req.body };

    console.log("data", data);
    firestore
      .collection(collection)
      .doc(id)
      .update(data)
      .then(() => {
        res.send({ data: "updated successfully" });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
    // ...
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const signOut = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        res.send("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signIn = (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        //  console.log(user)
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            const id = user.uid;

            let newUser = { token: idToken, uid: id };
            getUser(req, res, newUser);
          })
          .catch(function (error) {
            // Handle error
          });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

function mapUser(user) {
  const customClaims = user.customClaims || { role: "" };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

const getUser = async (req, res, user) => {
  try {
    const newuser = await firestore.collection("users").doc(user.uid);
    const data = await newuser.get();
    if (!data.exists) {
      res.status(404).send("user with the given ID not found");
    } else {
      res.send({ user: { ...data.data(), token: user.token } });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUsersWithCondition = async (req, res, next) => {
  try {
    const AvailableSlots = await firestore.collection("users");
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

const updateConsultancyFee = async (req, res, next) => {
  try {
    const collection = "users";
    console.log(req.body);
    let data = { ...req.body };

    console.log("data", data);
    firestore
      .collection(collection)
      .doc(data.id)
      .update(data)
      .then(() => {
        res.send({ data: "successfully updated " });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  signIn,
  signUp,
  generateToken,
  signOut,
  addUser,
  updateUser,
  getUsersWithCondition,
  updateConsultancyFee,
};

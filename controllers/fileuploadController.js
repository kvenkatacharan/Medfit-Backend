const config = require("../config");
const saltedMd5 = require("salted-md5");
const path = require("path");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { storage, firebase } = require("../db");
const { updateBooking } = require("../controllers/slotsController");
let newupload = upload.single("file");
const fileUpload = async (req, res, next) => {
  try {
    newupload(req, res, async function (err) {
      if (err) {
        console.log("There was an error uploading the image.", err);
      }
      const name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
      console.log("name", name);
      const fileName = name + path.extname(req.file.originalname);
      var metadata = {
        contentType: "application/pdf",
      };
      var storageRef = firebase.storage().ref();
      var uploadTask = storageRef
        .child("Pdfs/" + fileName)
        .put(req.file.buffer, metadata);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);

            let newreq = { body: { id: req.body.id, file_url: downloadURL } };
            updateBooking(newreq, res, next);
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

module.exports = {
  fileUpload,
};

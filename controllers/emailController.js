const config = require("../config");
const nodemailer = require("nodemailer");
let transport = nodemailer.createTransport(config.transportOptions);

const sendBookingConfirmationMail = async (options) => {
  console.log(options);
  const mailOptions = {
    from: "appmedfit@gmail.com", // Sender address
    to: options.patientEmail, // List of recipients
    subject: "Medfit- Video Consultation Booking Confirmation", // Subject line
    html: `
            <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"></p>
            <p style="font-size: 14px; line-height: 140%;">Dear ${options.patientName},
            <br />
            <br />
            Your video consultation with Dr ${options.doctorName} is confirmed for ${options.fullDate}.&nbsp;
             Please join the video call using below zoom link.</p>
              <br />
             <a href="${options.zoomUrl}" > Zoom Link: ${options.zoomUrl} </a>
            <p style="font-size: 14px; line-height: 140%;"><br />Regards,<br />Medfit Team</p>
            </div>
        `,
  };
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("err herre in mail");
        reject(err);
      } else {
        resolve("Mail sent Successfully");
      }
    });
  });
};

const sendPrescriptionMail = async (options, res, next) => {
  const mailOptions = {
    from: "appmedfit@gmail.com", // Sender address
    to: options.patientEmail, // List of recipients
    subject: "Medfit-Your prescription is available", // Subject line
    html: `
            <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"></p>
            <p style="font-size: 14px; line-height: 140%;">Dear ${options.patientName},
            <br />
            <br />
            Your prescription for video consultation with Dr ${options.doctorName}  on  ${options.fullDate} is availalble now.&nbsp;
            <p style="font-size: 14px; line-height: 140%;"><br />Regards,<br />Medfit Team</p>
            </div>
        `,
  };
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("err i em", error);
        console.log("err info em", info);
        reject(error);
      } else {
        resolve("Mail sent Successfully");
      }
    });
  });
};

module.exports = {
  sendBookingConfirmationMail,
  sendPrescriptionMail,
};

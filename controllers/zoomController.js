const config = require("../config");
const jwt = require("jsonwebtoken");
const rp = require("request-promise");
const payload = {
  iss: config.zoomConfig.apiKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.zoomConfig.apiSecret);
const createZoomMeetinglink = async (data) => {
  email = data.mail;

  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "Meeting",
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
        join_before_host: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };

  return rp(options);
};

module.exports = {
  createZoomMeetinglink,
};

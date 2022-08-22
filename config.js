"use strict";
const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  SMTP_PORT,
  SMTP_HOST,
  APIKey,
  APISecret,
  razorpay_key_id,
  razorpzy_key_secret,
  BUCKET_URL,
} = process.env;

assert(PORT, "PORT is required");
assert(HOST, "HOST is required");

module.exports = {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
  },
  transportOptions: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  },
  zoomConfig: {
    apiKey: APIKey,
    apiSecret: APISecret,
  },
  razorPayConfig: {
    key_id: razorpay_key_id,
    key_secret: razorpzy_key_secret,
  },
  BUCKET_URL: BUCKET_URL,
  DATABASE_URL: DATABASE_URL,
};

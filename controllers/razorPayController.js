const config = require("../config");
const shortid = require("shortid");
const Razorpay = require("razorpay");

const razorpay = new Razorpay(config.razorPayConfig);

const createRazorPayOrder = async (req, res, next) => {
  try {
    let data = req.body;
    console.log(data);
    const payment_capture = 1;
    const amount = data.consultancyFee;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const razorPayVerification = async (req, res, next) => {
  const secret = "12345678";

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    require("fs").writeFileSync(
      "payment1.json",
      JSON.stringify(req.body, null, 4)
    );
  } else {
    // pass it
  }
  res.json({ status: "ok" });
};
module.exports = {
  createRazorPayOrder,
};

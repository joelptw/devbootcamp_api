const NodeGeoCoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_KEY,
  formater: null
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;

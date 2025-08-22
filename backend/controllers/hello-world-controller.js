'use strict';

// This endpoint is protected by having a Bearer token in the Authorization request header.
exports.getHelloWorld = async (req, res) => {
  return res.status(200).json({ message: 'Hello World!' });
};

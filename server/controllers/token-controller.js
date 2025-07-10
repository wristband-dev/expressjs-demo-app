'use strict';

// Token Endpoint: Retrieves an access token and its expiration time to store in Wristband's react-client-auth SDK.
// Calling Wrisband's React SDK getToken() function calls this endpoint when there is no access token present in
// the React SDK client-side cache.
exports.getToken = async (req, res) => {
  const { accessToken, expiresAt } = req.session;

  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');

  return res.status(200).json({ accessToken, expiresAt });
};

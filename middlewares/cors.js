const corsMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    const allowedOrigins = ['https://truthtallyranker.com', 'https://dev.truthtallyranker.com', 'http://localhost'];

    const origin = req.headers.origin;
    const referrer = req.headers.referer;

    const isValidOrigin = origin && allowedOrigins.indexOf(origin) !== -1;
    const isValidReferrer = referrer && allowedOrigins.some((allowedOrigin) => referrer.startsWith(allowedOrigin));

    if (isValidOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (isValidReferrer) {
      res.setHeader('Access-Control-Allow-Origin', new URL(referrer).origin);
    } else {
      reject(new Error('Not allowed by CORS'));
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      resolve();
    } else {
      resolve();
    }
  });
};

export default corsMiddleware;

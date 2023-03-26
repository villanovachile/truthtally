const { v4: uuidv4 } = require('uuid');

let token = null;
let lastGenerated = null;

const generateToken = () => {
  const now = Date.now();
  const TEN_SECONDS = 10000;

  if (!token || now - lastGenerated >= TEN_SECONDS) {
    token = uuidv4();
    lastGenerated = now;
  }

  return token;
};

module.exports = {
  generateToken
};

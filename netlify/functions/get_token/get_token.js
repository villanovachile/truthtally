const { generateToken } = require('../../../utils/generate-token');

exports.handler = async (event, context) => {
  const token = generateToken();

  return {
    statusCode: 200,
    body: token
  };
};

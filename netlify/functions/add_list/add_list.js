const connectToDatabase = require('../../../utils/mongo-connection');
const randomstring = require('randomstring');
const validator = require('validator');

const validatePayload = (input) => {
  const errors = [];

  // Validate items
  if (!Array.isArray(input.items) || input.items.length === 0) {
    errors.push('List items must be an array with at least one element');
  } else {
    const itemSet = new Set();
    if (input.items.length < 3 || input.items.length > 50) {
      throw new Error('items array must contain at least three items and no more than fifty');
    }
    input.items.forEach(({ item, score, id }, index) => {
      if (!validator.isLength(item, { min: 1 })) {
        errors.push(`Item at index ${index} must not be empty`);
      }
      if (validator.isLength(item, { min: 1 }) && validator.trim(item) !== item) {
        errors.push(`Item at index ${index} should not have leading or trailing whitespace`);
      }
      if (itemSet.has(item)) {
        errors.push(`Item at index ${index} is a duplicate`);
      } else {
        itemSet.add(item);
      }
      if (!Number.isInteger(score)) {
        errors.push(`Score at index ${index} must be an integer`);
      }
      if (!Number.isInteger(id)) {
        errors.push(`ID at index ${index} must be an integer`);
      }
    });
  }

  // Validate unlisted
  if (typeof input.unlisted !== 'boolean') {
    errors.push('Unlisted must be a boolean');
  }

  // Validate title
  if (!validator.isLength(input.title, { min: 1, max: 100 })) {
    errors.push('Title must not be empty and must be no more than 100 characters');
  } else if (!/[a-zA-Z]/.test(input.title)) {
    errors.push('Title must contain at least one alphabetic character');
  } else if (validator.trim(input.title) !== input.title) {
    errors.push('Title should not have leading or trailing whitespace');
  }

  // Validate tags
  if (input.hasOwnProperty('tags')) {
    if (!Array.isArray(input.tags) || input.tags.length > 6) {
      errors.push('Tags must be an array with no more than 6 items');
    } else {
      const tagSet = new Set();
      input.tags.forEach((tag, index) => {
        if (!validator.isLength(tag, { min: 3, max: 20 })) {
          errors.push(`Tag at index ${index} must be between 3 and 20 characters`);
        }
        if (!validator.isAlphanumeric(tag)) {
          errors.push(`Tag at index ${index} must contain only alphanumeric characters`);
        }
        if (tagSet.has(tag)) {
          errors.push(`Tag at index ${index} is a duplicate`);
        } else {
          tagSet.add(tag);
        }
      });
    }
  }

  // Validate type
  if (!['ranked', 'unranked'].includes(input.type)) {
    errors.push('Type must be either "ranked" or "unranked"');
  }

  // Validate source_uri
  if (input.hasOwnProperty('source_uri')) {
    const source_uri = input.source_uri;
    if (!validator.isLength(source_uri, { max: 8 }) || !validator.isAlphanumeric(source_uri)) {
      throw new Error('source_uri must be no more than 8 alphanumeric characters.');
    }
  }
  console.log(input);
  // Validate author
  if (input.hasOwnProperty('author')) {
    console.log('THIS RAN');
    const author = input.author;
    if (author && !validator.isLength(author, { max: 30 })) {
      throw new Error('Author must be no more than 30 characters.');
    }
  }
  return errors;
};

const handler = async (event) => {
  const input = JSON.parse(event.body);

  // Use the validatePayload function to validate the input payload
  const errors = validatePayload(input);

  console.log(errors);

  // Check if there are any errors, and if so, return an HTTP 400 status code with the error messages
  if (errors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors })
    };
  }

  try {
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    let newURI = randomstring.generate(8);

    await collection.insertOne({
      [newURI]: input.items,
      views: 0,
      rating: 0,
      title: input.title,
      type: input.type,
      unlisted: input.unlisted,
      ...(input.author && { author: input.author }),
      ...(input.tags && input.tags.length > 0 && { tags: input.tags }),
      ...(input.source_uri && { source_uri: input.source_uri })
    });

    return {
      statusCode: 200,
      body: JSON.stringify(newURI)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

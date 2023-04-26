import connectToDatabase from '@/utils/mongo-connection';
import corsMiddleware from '@/middlewares/cors';
import randomstring from 'randomstring';
import { admin } from '@/middlewares/firebaseAdmin';
import validator from 'validator';

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
        if (!validator.isLength(tag, { min: 2, max: 20 })) {
          errors.push(`Tag at index ${index} must be between 2 and 20 characters`);
        }
        if (!validator.matches(tag, /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\-]+$/)) {
          errors.push(`Tag at index ${index} must contain only alphanumeric characters and hyphens`);
        }
        if (tagSet.has(tag.toLowerCase())) {
          errors.push(`Tag at index ${index} is a duplicate`);
        } else {
          tagSet.add(tag.toLowerCase());
        }
        if (tag.includes(' ')) {
          errors.push(`Tag at index ${index} must not contain any spaces`);
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

  // Validate author
  if (input.hasOwnProperty('author')) {
    const author = input.author;
    if (author && !validator.isLength(author, { max: 30 })) {
      throw new Error('Author must be no more than 30 characters.');
    }
  }
  return errors;
};

export default async function handler(req, res) {
  try {
    await corsMiddleware(req, res);

    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }

    const idToken = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const input = req.body;

    // Use the validatePayload function to validate the input payload
    const errors = validatePayload(input);

    // Check if there are any errors, and if so, return an HTTP 400 status code with the error messages
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    try {
      const database = await connectToDatabase(process.env.MONGODB_URI);
      const collection = database.collection(process.env.MONGODB_COLLECTION);
      let newURI = randomstring.generate(8);
      const tags = input.tags && input.tags.length > 0 ? input.tags.map((tag) => tag.toLowerCase()) : [];

      if (input.type.toLowerCase() === 'unranked') {
        // Use the versioned schema for unranked lists
        await collection.insertOne({
          uri: newURI,
          title: input.title,
          ...(input.author && { author: input.author }),
          type: input.type.toLowerCase(),
          unlisted: input.unlisted,
          ...(input.tags && input.tags.length > 0 && { tags: tags }),
          ...(input.source_uri && { source_uri: input.source_uri }),
          ...(input.author_uid && { author_uid: uid }),
          views: 0,
          rating: 0,
          versions: [
            {
              version: 1,
              items: input.items
            }
          ]
        });
      } else {
        await collection.insertOne({
          uri: newURI,
          items: input.items,
          title: input.title,
          ...(input.author && { author: input.author }),
          type: input.type.toLowerCase(),
          unlisted: input.unlisted,
          ...(input.tags && input.tags.length > 0 && { tags: tags }),
          ...(input.source_uri && { source_uri: input.source_uri }),
          ...(input.author_uid && { author_uid: uid }),
          ...(input.source_version && { source_version: input.source_version }),
          views: 0,
          rating: 0
        });
      }

      res.status(200).json(newURI);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

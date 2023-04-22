const admin = require('firebase-admin');
import fs from 'fs';

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize the admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = { admin };

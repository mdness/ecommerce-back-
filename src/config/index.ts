import dotenv from 'dotenv';
import path from 'path';
import minimist from 'minimist';

dotenv.config({
  path: path.resolve(`${process.env.NODE_ENV}.env`),
});

const args = minimist(process.argv.slice(2), {
  alias: {
    p: 'port',
  },
});

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MODEL_PERSISTANCE: process.env.MODEL_PERSISTANCE || 'mongoAtlas',
  PORT: args.p || 8080,
  MODE: process.env.MODE || 'noCluster',

  SESSION_SECRET: process.env.SESSION_SECRET || 'sessionSecret',
  SESSION_COOKIE_TIMEOUT_MIN: parseInt(
    process.env.SESSION_COOKIE_TIMEOUT_MIN || '10',
  ),

  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || 'user',
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || 'pass',
  MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || 'clusterURL',
  MONGO_ATLAS_MODE: process.env.MONGO_ATLAS_MODE || 'clusterUrl',
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || 'dbName',
  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || 'localDbName',

  FIREBASE_PRIVATEKEY: process.env.FIREBASE_PRIVATE_KEY || 'firebasePrivKey',
  FIREBASE_CLIENT_EMAIL:
    process.env.FIREBASE_CLIENT_EMAIL || 'firebaseClientEmail',
  FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID || 'firebaseProjectID',

  GMAIL_EMAIL: process.env.GMAIL_EMAIL || 'email@gmail.com',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || 'password',
  GMAIL_NAME: process.env.GMAIL_NAME || 'GMail owner name',

  ETHEREAL_EMAIL: process.env.ETHEREAL_EMAIL || 'yourEmailAccount',
  ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD || 'yourEmailPassword',
  ETHEREAL_NAME: process.env.ETHEREAL_NAME || 'yourName',

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_TOKEN: process.env.TWILIO_AUTH_TOKEN || 'TwilioToken',
  TWILIO_CELLPHONE: process.env.TWILIO_CELLPHONE || '+123456789',
  TWILIO_CELLPHONE_WHATSAPP:
    process.env.TWILIO_CELLPHONE_WHATSAPP || '+123456789',
  ADMIN_WHATSAPP: process.env.ADMIN_WHATSAPP || '+123456789',

  CLOUD_NAME: process.env.CLOUD_NAME || 'Cloudinary cloud name',
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || 'Cloudinary API key',
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET || 'Cloudinary API secret',
};

export default env;

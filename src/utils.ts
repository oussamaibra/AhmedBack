import {
  createCipheriv,
  randomBytes,
  scrypt,
  pbkdf2Sync,
  createDecipheriv,
} from 'crypto';

import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import 'dotenv/config';

// Multer configuration
export const multerConfig = {
  dest: process.env.UPLOAD_LOCATION,
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 9999 * 9999 * 99999,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(/\/(webp|mp4|jpg|jpeg|png)$/) || // jpg|jpeg|png|gif|pdf|doc|docx
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details

    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};

const ALGORITHM_NAME = 'aes-128-gcm';
const ALGORITHM_NONCE_SIZE = 12;
const ALGORITHM_TAG_SIZE = 16;
const ALGORITHM_KEY_SIZE = 16;
const PBKDF2_NAME = 'sha256';
const PBKDF2_SALT_SIZE = 16;
const PBKDF2_ITERATIONS = 32767;

export const encryptString = (plaintext, password) => {
  // Generate a 128-bit salt using a CSPRNG.
  const salt = randomBytes(PBKDF2_SALT_SIZE);

  // Derive a key using PBKDF2.
  const key = pbkdf2Sync(
    new Buffer(password, 'utf8'),
    salt,
    PBKDF2_ITERATIONS,
    ALGORITHM_KEY_SIZE,
    PBKDF2_NAME,
  );

  // Encrypt and prepend salt.
  const ciphertextAndNonceAndSalt = Buffer.concat([
    salt,
    encrypt(new Buffer(plaintext, 'utf8'), key),
  ]);

  // Return as base64 string.
  return ciphertextAndNonceAndSalt.toString('base64');
};

export const decryptString = (base64CiphertextAndNonceAndSalt, password) => {
  // Decode the base64.
  const ciphertextAndNonceAndSalt = new Buffer(
    base64CiphertextAndNonceAndSalt,
    'base64',
  );

  // Create buffers of salt and ciphertextAndNonce.
  const salt = ciphertextAndNonceAndSalt.slice(0, PBKDF2_SALT_SIZE);
  const ciphertextAndNonce = ciphertextAndNonceAndSalt.slice(PBKDF2_SALT_SIZE);

  // Derive the key using PBKDF2.
  const key = pbkdf2Sync(
    new Buffer(password, 'utf8'),
    salt,
    PBKDF2_ITERATIONS,
    ALGORITHM_KEY_SIZE,
    PBKDF2_NAME,
  );

  // Decrypt and return result.
  return decrypt(ciphertextAndNonce, key).toString('utf8');
};

export const encrypt = (plaintext, key) => {
  // Generate a 96-bit nonce using a CSPRNG.
  const nonce = randomBytes(ALGORITHM_NONCE_SIZE);

  // Create the cipher instance.
  const cipher = createCipheriv(ALGORITHM_NAME, key, nonce);

  // Encrypt and prepend nonce.
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  return Buffer.concat([nonce, ciphertext, cipher.getAuthTag()]);
};

export const decrypt = (ciphertextAndNonce, key) => {
  // Create buffers of nonce, ciphertext and tag.
  const nonce = ciphertextAndNonce.slice(0, ALGORITHM_NONCE_SIZE);
  const ciphertext = ciphertextAndNonce.slice(
    ALGORITHM_NONCE_SIZE,
    ciphertextAndNonce.length - ALGORITHM_TAG_SIZE,
  );
  const tag = ciphertextAndNonce.slice(
    ciphertext.length + ALGORITHM_NONCE_SIZE,
  );

  // Create the cipher instance.
  const cipher = createDecipheriv(ALGORITHM_NAME, key, nonce);
  // Decrypt and return result.
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(ciphertext), cipher.final()]);
};

export const abilityToString = (listAbility) => {
  let genString = '';
  listAbility.forEach((elem, i) => {
    if (i !== listAbility.length - 1)
      genString += elem.action + '-' + elem.subject + '/';
    else genString += elem.action + '-' + elem.subject;
  });
  return genString;
};
export const stringToAbility = (string) => {
  const listAbility = [];
  const list = string.split('/');
  let ability;
  list.forEach((elem) => {
    ability = elem.split('-');
    listAbility.push({ action: ability[0], subject: ability[1] });
  });
  return listAbility;
};

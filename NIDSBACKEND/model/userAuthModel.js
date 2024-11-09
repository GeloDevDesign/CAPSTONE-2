import db from "../config/db.js";

const saveOTP = async (email, otp, expires) => {
  const query = `UPDATE users SET otp = $1, otp_expires = $2 WHERE email = $3`;
  await db.query(query, [otp, expires, email]);
};

const findUserByOTP = async (email, otp) => {
  const query = 'SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expires > NOW()';
  const result = await db.query(query, [email, otp]);
  return result.rows[0];
};

const saveResetToken = async (email, token, expires) => {
  const query = `UPDATE users SET reset_token = $1, reset_token_expires = $2, otp = NULL, otp_expires = NULL WHERE email = $3`;
  await db.query(query, [token, expires, email]);
};

const findUserByResetToken = async (token) => {
  const query = 'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()';
  const result = await db.query(query, [token]);
  return result.rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
  const query = 'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2';
  await db.query(query, [hashedPassword, userId]);
};

const findUsernameAndEmail = async (username, email) => {
  const query = 'SELECT * FROM users WHERE username = $1 AND email = $2';
  const result = await db.query(query, [username, email]);
  return result.rows[0];
};

const clearResetToken = async (userId) => {
  const query = 'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = $1';
  await db.query(query, [userId]);
};

export default {
  saveOTP,
  findUserByOTP,
  saveResetToken,
  findUserByResetToken,
  updatePassword,
  findUsernameAndEmail,
  clearResetToken
};
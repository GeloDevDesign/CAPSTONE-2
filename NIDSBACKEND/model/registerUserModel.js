import db from '../config/db.js';

const login = async(username) =>{
  const query = `SELECT * FROM users WHERE username = $1`;
  const values = [username];
  const result = await db.query(query, values);

  return result
}

const register = async (values) => {
  const query = `
    INSERT INTO users (username, password, role, name, surname,gender,email) 
    VALUES ($1, $2, $3, $4, $5, $6 , $7) 
    RETURNING *`;

  const result = await db.query(query, values);

  return result.rows[0]; 
};


const getUser = async () =>{
  const query = `
      SELECT Name, Surname,Role,Username,Id,gender,email FROM users;
    `;

    const result = await db.query(query);
    return result.rows 
}


const getUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(query, [username]);
  return result.rows[0];
};

const incrementLoginAttempts = async (userId) => {
  const query = `
    UPDATE users 
    SET loginattempts = loginattempts + 1 
    WHERE id = $1 
    RETURNING loginattempts`;
  const result = await db.query(query, [userId]);
  return result.rows[0].loginAttempts;
};

const resetLoginAttempts = async (userId) => {
  const query = `
    UPDATE users 
    SET loginattempts = 0, lockeduntil = NULL 
    WHERE id = $1`;
  await db.query(query, [userId]);
};

const lockUserAccount = async (userId, lockUntil) => {
  const query = `
    UPDATE users 
    SET lockeduntil = $2 
    WHERE id = $1`;
  await db.query(query, [userId, lockUntil]);
};


const updateUser = async (values) => {
  const query = `
    UPDATE users 
    SET username = $1, role = $2, name = $3, surname = $4, email = $5 
    WHERE id = $6 
    RETURNING *;
  `;
  const result = await db.query(query, values);
  return result.rows[0];
};


export default {
  login,
  register,
  getUser,
  getUserByUsername,
  incrementLoginAttempts,
  resetLoginAttempts,
  lockUserAccount,
  updateUser

}
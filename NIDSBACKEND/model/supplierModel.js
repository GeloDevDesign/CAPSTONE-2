import db from '../config/db.js';

const addSupplier = async(values) =>{
   
      const query = `
    INSERT INTO supplier (
      name,
      contact,
      location,
      product
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  
  const result = await db.query(query, values);

  return result.rows[0]; 
} 


const getSupplier = async () => {
  const query = 'SELECT * FROM supplier ORDER BY id ASC;';
  const result = await db.query(query);
  return result.rows; 
};


const updateSupplier = async(values) =>{
  const query = `
  UPDATE supplier
  SET
    name = COALESCE($1, name),
    contact = COALESCE($2, contact),
    location = COALESCE($3, location),
    product = COALESCE($4, product)
  WHERE id = $5
  RETURNING *;
`;

const result = await db.query(query, values);
return result.rows[0];
}


// supplierModel.js
const deleteSupplier = async (values) => {
  const query = 'DELETE FROM supplier WHERE id = $1 RETURNING *';
  const result = await db.query(query, values);

  return result.rows; // Return the rows array
};




export default {
  addSupplier,
  getSupplier,
  updateSupplier,
  deleteSupplier
}
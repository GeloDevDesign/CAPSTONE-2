import db from "../config/db.js";


const getInsertDisposeItem = async() =>{
  const result = await db.query('SELECT * FROM dispose');
  return result.rows
}

const insertDisposeItem = async(insertDispose) => {
  const query = `
    INSERT INTO dispose (item_name, quantity, dispose_cost)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [insertDispose.itemName, insertDispose.itemQuantity, insertDispose.disposeCost];
  const result = await db.query(query, values);
  
  return result.rows[0]; 
}


const disposeItem = async(id,selectedStock)=>{

  const query = `UPDATE products SET ${selectedStock} = $1 WHERE id = $2 RETURNING *`; 
  const values = [0,id];
  const result = await db.query(query, values);

  return result.rows[0];
}






export default {
  getInsertDisposeItem,
  insertDisposeItem,
  disposeItem
};


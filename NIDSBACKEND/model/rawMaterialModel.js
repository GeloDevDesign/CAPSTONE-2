import db from "../config/db.js";

const insertRawItems = async (dataValue) => {
  
    const query = `INSERT INTO raw_materials (item_name, item_unit, item_quantity,maximum_quantity,expiration,category) 
                   VALUES ($1, $2, $3,$4,$5,$6) 
                   RETURNING *;`;  

    try {
        const result = await db.query(query, dataValue);
        return result;
    } catch (error) {
        throw new Error(`Database insert failed: ${error.message}`);
    }
};


const getRawItems = async() =>{

    try {
        const query = `SELECT * FROM raw_materials `;
        const result = await db.query(query);
        return result;


    } catch (error) {
        throw new Error(`Database Fetching Failed: ${error.message}`);
    }
}


const updateRawItems = async(values) =>{
    const query = `
    UPDATE raw_materials
      SET
        item_name = COALESCE($1, item_name),
        item_unit = COALESCE($2, item_unit),
        item_quantity = COALESCE($3, item_quantity),
       reordering_point = COALESCE($4, reordering_point),
        critical_point = COALESCE($5, critical_point),
         maximum_quantity = COALESCE($6, maximum_quantity),
         expiration = COALESCE($7, expiration)
      WHERE id = $8
      RETURNING *;`;
    const result = await db.query(query, values);
    return result;
}


const addtoPO = async (values) => {
    const query = `
      UPDATE raw_materials
      SET delivery_complete = $1  
      WHERE id = $2;  
    `;
    const result = await db.query(query, values);
    return result;
  };
  
    

const getItemAddedToPO = async()=>{
    const query = `SELECT * 
        FROM raw_materials ;
    ;

    
    `
    const result = await db.query(query);
    return result;
}



const batchUpdateRawItems = async (items) => {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      for (const item of items) {
        const query = 'UPDATE raw_materials SET item_quantity = item_quantity + $1 WHERE id = $2 RETURNING *';
        const values = [item.maximum_quantity - item.item_quantity, item.id];
        const result = await client.query(query, values);
        results.push(result.rows[0]);
      }
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }


export default {
    insertRawItems,
    getRawItems,
    updateRawItems,
    addtoPO,
    getItemAddedToPO,
    batchUpdateRawItems
};
    
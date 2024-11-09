import db from "../config/db.js";


const returnOrder = async (values, items) => {
  const query = `
    INSERT INTO returns (
      reason,
      cause,
      employee_name,
      total_charge,
      return_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING receipt_id;
  `;

  try {
   
    const returnResult = await db.query(query, values);
    const receipt_id = returnResult.rows[0].receipt_id;

   
    const insertedItems = [];

  
    for (const item of items) {
      const itemQuery = `
        INSERT INTO items (receipt_id, item_name, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const itemValues = [receipt_id, item.item_name, item.quantity];
      const itemResult = await db.query(itemQuery, itemValues);

   
      insertedItems.push(itemResult.rows[0]);
    }

    return { receipt_id, items: insertedItems };

  } catch (error) {
    throw new Error(`Failed to create return order: ${error.message}`);
  }
};


const getReturn = async(req,res) =>{
  const query = `
          SELECT 
          r.receipt_id,
          r.return_date,
          r.reason,
          r.cause,
          r.employee_name,
          r.total_charge,
          r.return_id,
          i.item_id,
          i.item_name,
          i.quantity
          FROM 
          returns r
          INNER JOIN 
              items i
          ON 
        r.receipt_id = i.receipt_id;
      `
      const result = await db.query(query);

      
       if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }

      const returnData = {};

      result.rows.forEach(row => {
        if (!returnData[row.receipt_id]) {
          returnData[row.receipt_id] = {
            receipt_id: row.receipt_id,
            return_date: row.return_date,
            reason: row.reason,
            cause: row.cause,
            total_charge: row.total_charge,
            return_id: row.return_id,
            employee_name: row.employee_name,
            item: []
          };
        }
        returnData[row.receipt_id].item.push({
          item_id: row.item_id,
          item_name: row.item_name,
          quantity: row.quantity
        });
      }); 

      return Object.values(returnData);
}




export default {
  returnOrder,
  getReturn,
};
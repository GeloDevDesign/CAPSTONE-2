import db from '../config/db.js'; 

const addOrderAndItems = async (creator_name, prepaired_items, raw_items,supplier) => {
  try {

    const orderQuery = `
      INSERT INTO purchase_order_info (creator_name,supplier)
      VALUES ($1,$2)
      RETURNING id
    `;
    const { rows } = await db.query(orderQuery, [creator_name,supplier]);
    const orderId = rows[0].id;

   
    const prepairedItemQuery = `
      INSERT INTO purchase_order_prepaired_items (purchase_order_id, item_name, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of prepaired_items) {
      await db.query(prepairedItemQuery, [orderId, item.item_name, item.quantity, item.unit_price]);
    }

  
    const rawItemQuery = `
      INSERT INTO purchase_order_raw_items (purchase_order_id, item_name, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
    `;
    for (const item of raw_items) {
      await db.query(rawItemQuery, [orderId, item.item_name, item.quantity, item.unit_price]);
    }

    return { message: 'Order and items added successfully!' };
  } catch (error) {
    throw new Error('Error adding order and items: ' + error.message);
  }
};




const getOrderWithItems = async () => {
  try {
    const query = `
      SELECT 
        poi.id AS order_id,
        poi.creator_name,
        poi.supplier,
        poi.created_at,  -- Include the created date
        ppi.item_name AS prepared_item_name,
        ppi.quantity AS prepared_item_quantity,
        ppi.unit_price AS prepared_item_unit_price,
        ppi.total_price AS prepared_item_total_price,
        rwi.item_name AS raw_item_name,
        rwi.quantity AS raw_item_quantity,
        rwi.unit_price AS raw_item_unit_price,
        rwi.total_price AS raw_item_total_price
      FROM 
        purchase_order_info poi
      LEFT JOIN 
        purchase_order_prepaired_items ppi ON poi.id = ppi.purchase_order_id
      LEFT JOIN 
        purchase_order_raw_items rwi ON poi.id = rwi.purchase_order_id
    `;

    const result = await db.query(query);
    const orders = {};

    result.rows.forEach(row => {
    
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          creator_name: row.creator_name,
          supplier: row.supplier,
          created_at: row.created_at, 
          prepared_items: [],
          raw_items: []
        };
      }


      if (row.prepared_item_name) {
        const existingPreparedItem = orders[row.order_id].prepared_items.find(item => item.item_name === row.prepared_item_name);
        if (existingPreparedItem) {
          existingPreparedItem.quantity += row.prepared_item_quantity; 
          existingPreparedItem.total_price = (parseFloat(existingPreparedItem.total_price) + parseFloat(row.prepared_item_total_price)).toFixed(2); 
        } else {
          orders[row.order_id].prepared_items.push({
            item_name: row.prepared_item_name,
            quantity: row.prepared_item_quantity,
            unit_price: row.prepared_item_unit_price,
            total_price: row.prepared_item_total_price
          });
        }
      } 

   
      if (row.raw_item_name) {
        const existingRawItem = orders[row.order_id].raw_items.find(item => item.item_name === row.raw_item_name);
        if (existingRawItem) {
          existingRawItem.quantity += row.raw_item_quantity; 
          existingRawItem.total_price = (parseFloat(existingRawItem.total_price) + parseFloat(row.raw_item_total_price)).toFixed(2);
        } else {
          orders[row.order_id].raw_items.push({
            item_name: row.raw_item_name,
            quantity: row.raw_item_quantity,
            unit_price: row.raw_item_unit_price,
            total_price: row.raw_item_total_price
          });
        }
      }
    });

    return Object.values(orders);
  } catch (error) {
    throw new Error('Error fetching orders with items: ' + error.message);
  }
};









export default {
  addOrderAndItems,
  getOrderWithItems
};

import db from "../config/db.js";

const voidOrders = async (items, transaction_id) => {
  // Start transaction
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
   
    // Process each void item
    for (const item of items) {
      // Update inventory by adding back the voided quantity
      const updateInventoryQuery = `
        UPDATE products 
        SET stock_1 = stock_1 + $1 
        WHERE name = $2 
        RETURNING *
      `;
      await client.query(updateInventoryQuery, [item.void_quantity, item.item_name]);
      
      // Update order_items quantity
      const updateOrderItemQuery = `
        UPDATE order_items 
        SET quantity = quantity - $1
        WHERE order_id = $2 AND item_id = $3
        RETURNING *
      `;
      await client.query(updateOrderItemQuery, [
        item.void_quantity, 
        transaction_id, 
        item.item_id
      ]);
      
      // Calculate amount to deduct based on the voided quantity
      const amountToDeduct = item.void_quantity * parseFloat(item.price);
      
      // Update order total_cost ensuring it does not go below zero
      const updateOrderQuery = `
        UPDATE orders 
        SET total_cost = GREATEST(total_cost - $1, 0)
        WHERE order_id = $2 
        RETURNING *
      `;
      await client.query(updateOrderQuery, [amountToDeduct, transaction_id]);
    }
    
    await client.query('COMMIT');
  
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};






export default {
  voidOrders
}
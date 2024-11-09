import db from "../config/db.js";

const transaction = async(orderValues, items) => {
  
  const orderQuery = `
    INSERT INTO orders
    (total_cost, change_amount, pay_cash, order_source, order_type, is_discounted, discount_name, total_discount,customer_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
    RETURNING order_id
  `;

  try {
    const orderResult = await db.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].order_id;

    
    for (const item of items) {
      const itemQuery = `
        INSERT INTO order_items (order_id, item_name, price, quantity)
        VALUES ($1, $2, $3, $4)
      `;
      const itemValues = [orderId, item.name, item.price, item.quantity];
      await db.query(itemQuery, itemValues);
    }

    return orderId;
  } catch (err) {
    throw new Error(`Transaction failed: ${err.message}`);
  }
};



const getTransaction = async () => {
  const query = `
  SELECT o.order_id, o.total_cost, o.change_amount, o.pay_cash, o.order_source, o.order_type,
         o.is_discounted, o.discount_name, o.total_discount, o.created_at, o.customer_id,
         oi.item_id, oi.item_name, oi.price, oi.quantity
  FROM orders o
  INNER JOIN order_items oi ON o.order_id = oi.order_id
  `;

  // Execute query
  const result = await db.query(query);

  const orders = {};

  result.rows.forEach(row => {
    if (!orders[row.order_id]) {
      orders[row.order_id] = {
        order_id: row.order_id,
        total_cost: row.total_cost,
        change_amount: row.change_amount,
        pay_cash: row.pay_cash,
        order_source: row.order_source,
        order_type: row.order_type,
        is_discounted: row.is_discounted,
        discount_name: row.discount_name,
        customer_id: row.customer_id, // correctly selected from orders
        total_discount: row.total_discount,
        created_at: row.created_at,
        items: []
      };
    }
    orders[row.order_id].items.push({
      item_id: row.item_id,
      item_name: row.item_name,
      price: row.price,
      quantity: row.quantity
    });
  });

  return Object.values(orders);
};


const saleRemit = async (orderValues) => {
  const query = `
    INSERT INTO sales_summary
    (cashier_name, remitted_sales, short_sales)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await db.query(query, orderValues);
  return result.rows;
};


const updateSalesRemit = async (values) =>{

  const query = 'UPDATE sales_summary SET short_sales = $1 ,validated_sales = $2 WHERE id = $3 RETURNING *;'
  const result = await db.query(query, values);
  return result;

}


const getSalesRemit = async() =>{
  const result = await db.query('SELECT * FROM sales_summary');
  return result.rows;
}




export default {
  getTransaction,
  transaction,
  saleRemit,
  updateSalesRemit,
  getSalesRemit
};
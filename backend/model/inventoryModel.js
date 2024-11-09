import db from "../config/db.js";


const getAllProducts = async () => {
  const result = await db.query('SELECT * FROM products');
  return result.rows;
};


const addProduct = async (values) => {
  const query = `
    INSERT INTO products (
      name, price_1, price_2, category, stock_1, stock_2, 
      expiration_1, expiration_2, maximum_quantity, reordering_point, 
      image_url, missing_quantity
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12, 0)) 
    RETURNING *`;
  
  const result = await db.query(query, values);
  return result.rows[0];
};

const updateProduct = async (values) => {
  const query = `
    UPDATE products
    SET
      price_1 = COALESCE($1, price_1),
      price_2 = COALESCE($2, price_2),
      stock_1 = COALESCE($3, stock_1),
      stock_2 = COALESCE($4, stock_2),
      expiration_1 = COALESCE($5, expiration_1),
      expiration_2 = COALESCE($6, expiration_2),
      maximum_quantity = COALESCE($7, maximum_quantity),
      reordering_point = COALESCE($8, reordering_point),
      critical_point = COALESCE($9, critical_point)
    WHERE id = $10
    RETURNING *;
  `;
  
  const result = await db.query(query, values);
  return result.rows[0];
};


const getProductById = async (id) => {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};


const updateProductStock = async (stock_1, stock_2, id) => {
  const updateQuery = `
    UPDATE products 
    SET stock_1 = $1, stock_2 = $2 
    WHERE id = $3
    RETURNING *;
  `;
  
  const result = await db.query(updateQuery, [stock_1, stock_2, id]);
  return result.rows[0];
};


const swapItem = async(stock_1,stock_2,id)=>{
  const updateQuery = `
  UPDATE products 
  SET stock_1 = $1, stock_2 = $2 
  WHERE id = $3
  RETURNING *;
`;

const result = await db.query(updateQuery, [stock_1, stock_2, id]);
return result.rows;
}


export default {
  getAllProducts,
  addProduct,
  updateProduct,
  getProductById,
  updateProductStock,
  swapItem
};
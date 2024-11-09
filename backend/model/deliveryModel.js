import db from "../config/db.js";

const deliveryUpdate = async (incorrectItem,missing, id) => {
    const query = `UPDATE products 
    SET delivery_complete = $1, missing_quantity = $2 
    WHERE id = $3 
    RETURNING *`;

    const values = [incorrectItem, missing,id]; 

    const result = await db.query(query, values);
    return result.rows[0]; 
}

const insertDeliveryItems = async (deliveryItemsSuccess) => {
    
    for (const item of deliveryItemsSuccess) {
        const stockQuery = 'SELECT id, stock_1, stock_2, maximum_quantity, reordering_point FROM products WHERE id = $1';
        const stockResult = await db.query(stockQuery, [item.id]);

        if (stockResult.rows.length === 0) {
            throw new Error(`Product with ID ${item.id} not found`);
        }

        const { stock_1, stock_2, maximum_quantity } = stockResult.rows[0];

    
        let selectedStock = stock_1 > 0 ? 'stock_2' : 'stock_1';

    
        let totalReorder = item.maximum_quantity - item.missing_quantity

       
        totalReorder = Math.min(totalReorder, maximum_quantity);

        const updateQuery = `UPDATE products SET ${selectedStock} = ${selectedStock} + $1 WHERE id = $2 RETURNING *`;
        await db.query(updateQuery, [totalReorder, item.id]);
    }
};


const deliveryCompleted = async(missing_quantity,id)=>{
    const query = `
    UPDATE products 
    SET stock_2 = stock_2 + $1, 
        missing_quantity = 0 
    WHERE id = $2 
    RETURNING *`;

    const values = [missing_quantity, id]; 
    const result = await db.query(query, values);
    return result.rows[0]; 
  
}


const deliveryUpdateRaw = async (incorrectItem,missing, id) => {
    const query = `UPDATE raw_materials
    SET delivery_complete = $1, missing_quantity = $2 
    WHERE id = $3 
    RETURNING *`;

    const values = [incorrectItem, missing,id]; 

    const result = await db.query(query, values);
    return result.rows[0]; 
}

const deliveryCompletedRaw = async(missing_quantity,id)=>{
    const query = `
    UPDATE raw_materials 
    SET item_quantity = item_quantity + $1, 
        missing_quantity = 0 
    WHERE id = $2 
    RETURNING *`;
    
    const values = [missing_quantity, id]; 
    const result = await db.query(query, values);
    return result.rows[0]; 
}

export default {
    deliveryUpdate,
    insertDeliveryItems,
    deliveryCompleted,
    deliveryUpdateRaw,
    deliveryCompletedRaw
};

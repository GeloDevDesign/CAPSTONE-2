import db from "../config/db.js";


const getDisposeValue = async (month, year) => {
  const query = `
    SELECT 
      COALESCE(SUM(dispose_cost), 0) AS total_cost,
      COUNT(*) AS count
    FROM 
      dispose
    WHERE 
      EXTRACT(MONTH FROM dispose_date) = $1
      AND EXTRACT(YEAR FROM dispose_date) = $2
  `;
  const values = [month, year];
  
  const result = await db.query(query, values);
  return {
    total_cost: result.rows[0].total_cost,
    count: result.rows[0].count,
  };
};





export default {
  getDisposeValue
}
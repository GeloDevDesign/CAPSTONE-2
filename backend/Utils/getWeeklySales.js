import express from 'express';

export default function (db) {
  const router = express.Router();

  // Weekly Sales Route
  router.get('/weekly-sales', async (req, res) => {
    try {
      const { year, weekStart, weekEnd } = req.query;

      // Updated SQL query to aggregate daily sales
      const query = `
       SELECT 
        TRIM(TO_CHAR(transaction_date, 'Day')) AS weekday, 
        SUM(CAST(remitted_sales AS FLOAT) - CAST(short_sales AS FLOAT)) AS total_sales
      FROM 
        sales_summary
      WHERE 
        EXTRACT(YEAR FROM transaction_date) = $1
        AND transaction_date BETWEEN $2 AND $3
        AND validated_sales = true
      GROUP BY weekday
      ORDER BY
        CASE
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Monday' THEN 1
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Tuesday' THEN 2
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Wednesday' THEN 3
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Thursday' THEN 4
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Friday' THEN 5
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Saturday' THEN 6
          WHEN TRIM(TO_CHAR(transaction_date, 'Day')) = 'Sunday' THEN 7
  END;

      `;

      // Execute the query and pass the parameters
      const result = await db.query(query, [year, weekStart, weekEnd]);

      // Return the aggregated result
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error('Error fetching weekly sales:', error);
      res.status(500).json({ success: false, message: 'Error fetching weekly sales' });
    }
  });

  return router;
}

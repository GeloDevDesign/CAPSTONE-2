import POModel from "../model/POModel.js";


const addOrder = async (req, res) => {
  const { creator_name, prepaired_items, raw_items,supplier } = req.body;

  try {
    const result = await POModel.addOrderAndItems(creator_name, prepaired_items, raw_items,supplier);
    res.json(result);

  } catch (error) {
    console.error('Error adding order and items:', error);
    res.status(500).json({ error: error.message });
  }
};


const getOrdersWithItems = async (req, res) => {
  try {
    const ordersWithItems = await POModel.getOrderWithItems();
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error('getting po list:', error);
  }
};



const getTotalMissingQuantity = async (req, res) => {
  try {
      const totalMissingQuantityCount = await POModel.getTotalMissingQuantityCount();

      if(totalMissingQuantityCount.length === 0) {
        return res.status(204).send(); // Send 204 with no content
      }
      
      return res.status(200).json({
          message: 'Total missing quantities retrieved successfully',
          total_missing_quantity_count: totalMissingQuantityCount,
      });
  } catch (error) {
      console.error("Error fetching total missing quantities:", error);
      return res.status(500).json({
          message: 'An error occurred while fetching missing quantities',
          error: error.message,
      });
  }
};

export default {
  addOrder,
  getOrdersWithItems,
  getTotalMissingQuantity
};
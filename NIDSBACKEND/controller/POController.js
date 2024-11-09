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



export default {
  addOrder,
  getOrdersWithItems
};
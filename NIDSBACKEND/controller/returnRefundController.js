import returnRefundModel from "../model/returnRefundModel.js";


const returnItems = async(req, res) =>{

  const {
    reason,
    cause,
    employeeName,
    totalCost,
    items,
    returnId
  } = req.body;

  const values = [reason, cause, employeeName, totalCost,returnId];

  try {

    const result = await returnRefundModel.returnOrder(values,items);
    res.status(201).json({ result, message: 'Order created successfully' });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'An error occurred while creating the order', details: error.message });
  }

  
}


const getReturn = async (req, res) => {
  try {
    // Fetch the return data from the model
    const result = await returnRefundModel.getReturn();

    // Check if no data was returned
    if (result.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Send the result back in the response
    res.status(200).json(result); // Send the result directly
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'An error occurred while fetching orders', details: error.message });
  }
};



export default {
  returnItems,
  getReturn,
};
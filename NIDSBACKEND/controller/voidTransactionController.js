import voidOrdersModel from "../model/voidTransactionModel.js";

const voidOrders = async (req, res) => {
  const { items, transaction_id } = req.body; 
  try {
    const result = await voidOrdersModel.voidOrders(items, transaction_id);
    res.status(200).json({ 
      message: 'Order voided successfully',
      updatedOrder: result 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 
export default { 
  voidOrders
}
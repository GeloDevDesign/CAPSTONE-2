import orderModel from "../model/orderModel.js";


const postTransaction = async (req, res) => {
  const {
    total_cost,
    change_amount,
    pay_cash,
    order_source,
    order_type,
    is_discounted,
    discount_name,
    total_discount,
    customer_id,
    items
  } = req.body;

  const orderValues = [
    total_cost,
    change_amount,
    pay_cash,
    order_source,
    order_type,
    is_discounted,
    discount_name,
    total_discount,
    customer_id,
  ];

  try {
    
    const orderId = await orderModel.transaction(orderValues, items);
    res.status(201).json({ order_id: orderId, message: 'Order created successfully' });

  } catch (error) {
    console.error('Detailed error:', error.message);
    res.status(500).json({ message: 'An error occurred while creating the order', details: error.message });
  }
};


const getTransaction = async (req, res) => {
  try {
   
    const orders = await orderModel.getTransaction();

    if (orders.length === 0) {
      return res.status(204).send(); // Send 204 with no content
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Detailed error:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching orders', details: error.message });
  }
};


const saleRemit = async (req, res) => {
  const { cashier_name, remitted_sales, short_sales } = req.body;

  const orderValues = [cashier_name, remitted_sales, short_sales];

  try {
    const result = await orderModel.saleRemit(orderValues);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Unsuccessful remitted sales' });
    }


    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Detailed error:', error.message);
    res.status(500).json({ message: 'An error occurred while remitting sales', details: error.message });
  }
};

const updateSalesRemit = async(req,res)=>{

  const {id} = req.params;
  const {shortage, approved} = req.body;
  const values = [shortage,approved,id];

  try {

    const result = await orderModel.updateSalesRemit(values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No Sales Found' });
    };

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'An error occurred while submitting orders', details: error.message });
  }


  
}


const getSalesRemit = async (req, res) => {
  try {
    // Fetch the sales remit from the model
    const result = await orderModel.getSalesRemit();

   
    if (result.length === 0) {
      return res.status(404).json({ message: 'No sales found' });
    }


    res.status(200).json(result); 
  } catch (error) {
    console.error('Detailed error:', error.message);
    res.status(500).json({ message: 'An error occurred while remitting sales', details: error.message });
  }
};

export default {
  getTransaction,
  postTransaction,
  saleRemit,
  updateSalesRemit,
  getSalesRemit
}
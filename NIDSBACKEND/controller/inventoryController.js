import inventoryModel from "../model/inventoryModel.js";



const getProducts = async (req, res) => {
  try {
    const products = await inventoryModel.getAllProducts();
    if (!products.length) {
      return res.status(404).json({ error: 'No items found' });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching products', details: err.message });
  }
};



const addProduct = async (req, res) => {
  const { 
    name, price_1, price_2, category, stock_1, stock_2, 
    expiration_1, expiration_2, maximum_quantity, reordering_point, missing_quantity = 0 
  } = req.body;
  
  const image_url = req.file ? req.file.filename : null;
  
  try {
    const values = [
      name, price_1, price_2, category, stock_1, stock_2,
      expiration_1, expiration_2, maximum_quantity, reordering_point,
      image_url, missing_quantity
    ];
    
    const newProduct = await inventoryModel.addProduct(values);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while adding the product', details: err.message });
  }
};


 

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    price_1, price_2, stock_1, stock_2,
    expiration_1, expiration_2, maximum_quantity, reordering_point,critical_point,
  } = req.body;

  try {
    const values = [
      price_1, price_2, stock_1, stock_2,
      expiration_1, expiration_2, maximum_quantity, reordering_point, critical_point,id,
    ];

    const updatedProduct = await inventoryModel.updateProduct(values);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the product', details: err.message });
    console.log(err)
  }
};


const updateStock = async (req, res) => {
  const { items } = req.body;

  try {
    
    for (const item of items) {
      const product = await inventoryModel.getProductById(item.id);

      if (!product) {
        throw new Error(`Product with ID ${item.id} not found`);
      }

      let { stock_1, stock_2 } = product;
      let quantityToDeduct = item.quantity;

      if (stock_1 >= quantityToDeduct) {
        stock_1 -= quantityToDeduct;
      } else {
        quantityToDeduct -= stock_1;
        stock_1 = 0;

        if (stock_2 >= quantityToDeduct) {
          stock_2 -= quantityToDeduct;
        } else {
          throw new Error(`Insufficient stock for product ${item.id}`);
        }
      }

      await inventoryModel.updateProductStock(stock_1, stock_2, item.id);
    }

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (err) {
 
    res.status(500).json({ message: err.message });
  }
};


const swapItem = async (req, res) => {
  const { itemId } = req.body;  

  try {
      for (const item of itemId) {  
          
          await inventoryModel.swapItem(item.stock_2, item.stock_1, item.id);  
      }

      res.status(200).json({ message: 'Stock updated successfully' });  // Success response
  } catch (error) {
      res.status(500).json({ message: error.message });  // Error handling
  }
};




export default {
  getProducts,
  addProduct,
  updateProduct,
  updateStock,
  swapItem
};
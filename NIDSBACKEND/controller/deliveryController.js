import deliveryModel from '../model/deliveryModel.js';

const deliveryUpdate = async(req, res) => {
    const { id } = req.params; 
    const { incorrectItem,missing } = req.body; 
    

    try {


        const delivery = await deliveryModel.deliveryUpdate(incorrectItem,missing, id);
        res.status(200).json(delivery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const insertDeliveryItems = async(req, res) => {
    const { deliveryItemsSuccess } = req.body;
    try {
        await deliveryModel.insertDeliveryItems(deliveryItemsSuccess);
        res.status(200).json({ message: 'Inventory updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deliveryCompleted = async (req, res) => {
    const { missing_quantity } = req.body;
    const { id } = req.params;
    try {
      const updatedProduct = await deliveryModel.deliveryCompleted(missing_quantity, id);
      res.status(200).json({ 
        message: 'Missing Quantity successfully Added',
        product: updatedProduct, // Optionally return the updated product details
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  const deliveryUpdateRaw = async(req, res) => {
    const { id } = req.params; 
    const { incorrectItem,missing } = req.body; 
    

    try {
        const delivery = await deliveryModel.deliveryUpdateRaw(incorrectItem,missing, id);
        res.status(200).json(delivery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const deliveryCompletedRaw = async (req, res) => {
    const { missing_quantity } = req.body;
    const { id } = req.params;
    try {
      const updatedProduct = await deliveryModel.deliveryCompletedRaw(missing_quantity, id);
      res.status(200).json({ 
        message: 'Missing Quantity successfully Added',
        product: updatedProduct, // Optionally return the updated product details
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  
export default {
    deliveryUpdate,
    insertDeliveryItems,
    deliveryCompleted,
    deliveryUpdateRaw,
    deliveryCompletedRaw
};

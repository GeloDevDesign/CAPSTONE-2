import rawMaterials from '../model/rawMaterialModel.js'

const insertRawItems = async (req, res) => {
  const { item_name, item_unit, item_quantity,maximum_quantity,expiration,category } = req.body;

  if (!item_name || !item_unit || item_quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  const dataValue = [item_name, item_unit, item_quantity,maximum_quantity,expiration,category];

  try {
    const result = await rawMaterials.insertRawItems(dataValue);
    return res.status(201).json(result.rows[0] );
} catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
        error: 'An error occurred while adding the product', 
        details: error.message,
        stack: error.stack 
    });
}
};


const getRawItems = async(req,res)=>{
    try {
      const result = await rawMaterials.getRawItems();

      if (result.rows.length === 0) {
        return res.status(204).send(); // Send 204 with no content
      };

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ message: 'An error occurred while Fetching Items', details: error.message });
    }
}


const updateRawItems = async(req, res) => {

  const {item_name, item_unit, item_quantity,reordering_point,critical_point,maximum_quantity, expiration,id} = req.body;
  const values = [item_name, item_unit, item_quantity, reordering_point,critical_point,maximum_quantity,expiration,id];

  try {
    const result = await rawMaterials.updateRawItems(values);
    
    if (!result || result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or not updated' });
    }
    

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating raw materials:', error);
    res.status(500).json({ error: 'An error occurred while updating the raw materials', details: error.message });
  }
}


const addtoPO = async (req, res) => {
  const { id } = req.params;
  const { PO } = req.body;
  const values = [PO, id]

  try {
    const result = await rawMaterials.addtoPO(values); 

    if (!result || result.rowCount === 0) { 
      return res.status(404).json({ error: 'Item not found or not updated' });
    }
    res.status(200).json({ message: 'Update successful' });

  } catch (error) {
    console.error('Error updating raw materials:', error);
    res.status(500).json({ 
      error: 'An error occurred while updating the raw materials', 
      details: error.message 
    });
  }
};


const getItemAddedToPO = async(req,res)=>{
  try {
    const result =  await rawMaterials.getItemAddedToPO();

    if (!result || result.rowCount === 0) { 
      return res.status(204).json({ error: 'No Product Item' });
    }

   res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error updating raw materials:', error);
    res.status(500).json({ 
      error: 'An error occurred while updating the raw materials', 
      details: error.message 
    });
  }
}



const batchUpdateRawItems = async (req, res) => {

  const { deliveryRawItems } = req.body;
  
  try {
    const result = await rawMaterials.batchUpdateRawItems(deliveryRawItems);
    res.status(200).json({ 
      message: 'Raw items updated successfully', 
      updatedItems: result 
    });
  } catch (error) {
    console.error('Error updating raw materials:', error);
    res.status(500).json({ 
      error: 'An error occurred while batch updating the raw materials', 
      details: error.message 
    });
  }
}

export default {
  insertRawItems,
  getRawItems,
  updateRawItems,
  addtoPO,
  getItemAddedToPO,
  batchUpdateRawItems
};

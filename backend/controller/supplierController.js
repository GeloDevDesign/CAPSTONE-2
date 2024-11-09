import supplierModel from "../model/supplierModel.js";

const addSupplier = async (req,res) =>{
  const {name,contact,location,product} = req.body;
  const values = [name,contact,location,product]
  try {
    const result = await supplierModel.addSupplier(values);
  

    if (result.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(201).json(result);

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'An error occurred while fetching orders', details: error.message });
  }
}


const getSupplier = async (req, res) => {
  try {
    const result = await supplierModel.getSupplier(); // Add await here

    if (result.length === 0) { // Use .length to check if no suppliers found
      return res.status(204).send(); // Send 204 with no content
    }
    res.status(200).json(result); // Send result directly
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'An error occurred while fetching suppliers', details: error.message });
  }
};

const updateSupplier = async(req,res) => {
  const {name,contact,location,product} = req.body;
  const {id} = req.params;
  
  const values = [name,contact,location,product,id];

  try {
    const result = await supplierModel.updateSupplier(values);

    if (result.length === 0) { 
      return res.status(404).json({ message: 'No Supplier found' });
    }

    res.status(200).json(result); // Send result directly
    
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'An error occurred while updating suppliers', details: error.message });
  }
}

// supplierController.js
const deleteSupplier = async (req, res) => {
  const id = Number(req.params.id);

  // Validate ID
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid ID provided.' });
  }

  const values = [id];

  try {
    const deletedRows = await supplierModel.deleteSupplier(values); 

    if (deletedRows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    res.status(200).json({ 
      message: 'Supplier deleted successfully', 
      deletedSupplierId: id  
    });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'An error occurred while deleting the supplier', 
      details: error.message 
    });
  }
};






export default {
  addSupplier,
  getSupplier,
  updateSupplier,
  deleteSupplier
}
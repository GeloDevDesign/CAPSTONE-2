import inventoryDisposeModel from "../model/inventoryDisposeModel.js";

const getInsertDisposeItem = async (req, res) => {
  try {
    const disposeItems = await inventoryDisposeModel.getInsertDisposeItem();
    if (!disposeItems.length) {
      return res.status(204).send(); // Send 204 with no content
    }
    res.status(200).json(disposeItems);
  } catch (error) {
    console.error('Error fetching dispose items:', error);
    res.status(500).json({ message: 'An error occurred while fetching products', details: error.message });
  }
};

const insertDisposeItem = async (req, res) => {
  const { insertDispose } = req.body;
  try {
    const disposedItem = await inventoryDisposeModel.insertDisposeItem(insertDispose);
    res.status(200).json(disposedItem);
  } catch (error) {
    console.error('Error inserting dispose item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const disposeItem = async (req, res) => {
  const { id } = req.params;
  const { selectedStock } = req.body;
  try {
    const disposedItem = await inventoryDisposeModel.disposeItem(id, selectedStock);
    if (!disposedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(disposedItem);
  } catch (error) {
    console.error('Error updating dispose item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getInsertDisposeItem,
  insertDisposeItem,
  disposeItem,
};

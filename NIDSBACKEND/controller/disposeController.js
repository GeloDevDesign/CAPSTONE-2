import disposeModel from "../model/disposeModel.js";


const getMonthlyDisposeCost = async (req, res) => {
  try {
    // Get the current date if no month/year provided
    const today = new Date();
    const month = req.query.month || today.getMonth() + 1; // Months are 0-based in JavaScript
    const year = req.query.year || today.getFullYear();

    const disposeCost = await disposeModel.getDisposeValue(month, year);

    return res.status(200).json(disposeCost);
  } catch (error) {
    console.error('Error fetching disposal cost:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



export default {
  getMonthlyDisposeCost,

}
// controllers/paymentController.js
const Contract = require('../models/Contract');

exports.markContractAsPaid = async (req, res) => {
  try {
    const { contractId } = req.body;

    await Contract.findByIdAndUpdate(contractId, {
      isPaid: true,
    });

    res.json({ message: 'Contract marked as paid' });
  } catch (err) {
    console.error('❌ Failed to update payment status:', err);
    res.status(500).json({ message: 'Failed to update contract payment status' });
  }
};

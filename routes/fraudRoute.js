const express = require('express');
const router = express.Router();
const WalletModel = require('../models/wallet');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const emailService = require('../utils/mockEmail');
const { fraudDetection } = require('./fraudRoute'); // Import the fraud detection function

// Route to check fraud
router.get('/', auth, async (req, res) => {
    const wallet = await WalletModel.findOne({ userId: req.user.id });
    if (!wallet) {
        return res.status(400).json({ message: "No wallet found" });
    }

    const suspicious = fraudDetection(wallet.transactions);

    if (suspicious.length === 0) {
        return res.status(200).json({ message: "No suspicious transactions found" });
    } else {
        wallet.markModified('transactions'); // Let Mongoose know transactions changed
  await wallet.save();
        // emailService("admin@gmail.com", `Suspicious transactions detected for user ${req.user.id}. Please review the transactions. \n 
        //     ${JSON.stringify(suspicious, null, 2)}`);
        // // Send email notification 
        return res.status(200).json({
            message: "Suspicious transactions found",
            suspiciousTransactions: suspicious
        });
    }
});

module.exports = router;
// Export the fraud detection function for testing purposes

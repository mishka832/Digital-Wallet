const express = require('express');
const router = express.Router();
const WalletModel = require('../models/wallet');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const userModel = require('../models/user');
const adminAuth = require('../middleware/admin.auth');
// admin can view all users and their wallets
router.get('/users', adminAuth, async (req, res) => {
    const users = await userModel.find()
    if (users) {
        res.status(200).json({
            message: "Users fetched successfully",
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }))
        });
    } else {
        res.status(404).json({ message: "No users found" });
    }
})
// admin can view all the transactions of all users
router.get('/transactions', adminAuth, async (req, res) => {
    try {
        const wallets = await WalletModel.find();
        const userTransactions = [];

        if (wallets) {
            wallets.forEach(wallet => {
                const transactions = wallet.transactions.map(transaction => ({
                    userId: wallet.userId,
                    transactionid: transaction._id,
                    amount: transaction.amount,
                    type: transaction.type,
                    date: transaction.date,
                    flag: transaction.flag
                }));
                userTransactions.push(...transactions); // Flattening the array
            });

            res.status(200).json({
                message: "Transactions fetched successfully",
                transactions: userTransactions
            });
        } else {
            res.status(404).json({ message: "No transactions found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
// admin can view all the flagged transactions

router.get('/flagged-transactions', adminAuth, async (req, res) => {
    try {
        const wallets = await WalletModel.find();
        const flaggedTransactions = [];

        if (wallets) {
            wallets.forEach(wallet => {
                const flagged = wallet.transactions.filter(transaction => transaction.flag === true);
                flagged.forEach(transaction => {
                    flaggedTransactions.push({
                        userId: wallet.userId,
                        transactionid: transaction._id,
                        amount: transaction.amount,
                        type: transaction.type,
                        date: transaction.date,
                        flag: transaction.flag
                    });
                });
            });

            if (flaggedTransactions.length > 0) {
                res.status(200).json({
                    message: "Flagged Transactions fetched successfully",
                    transactions: flaggedTransactions
                });
            } else {
                res.status(404).json({ message: "No flagged transactions found" });
            }
        } else {
            res.status(404).json({ message: "No wallets found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
// view top users by balance
router.post('/top-users', adminAuth, async (req, res) => {
  try {
    const { count } = req.body;

    // Validate count
    if (!count || typeof count !== 'number' || count <= 0) {
      return res.status(400).json({ message: "Invalid count value" });
    }
    const topUsers = await WalletModel.find()
      .sort({ balance: -1 })            // Sort by balance descending
      .limit(count)                    // Limit to 'count' users
      .select('userId balance -_id'); // Select only userId and balance, exclude _id

    if (!topUsers || topUsers.length === 0) {
      return res.status(404).json({ message: "No wallets found" });
    }

    return res.status(200).json({
      message: "Top users fetched successfully",
      users: topUsers.map(user => ({
        id: user.userId,
        balance: user.balance
      }))
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});
// aggregating the total balance of all users
router.get('/total-balance', adminAuth, async (req, res) => {
    try {
        const totalBalance = await WalletModel.aggregate([
            { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
        ]);

        if (totalBalance.length > 0) {
            res.status(200).json({
                message: "Total balance fetched successfully",
                totalBalance: totalBalance[0].totalBalance
            });
        } else {
            res.status(404).json({ message: "No wallets found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports = router;

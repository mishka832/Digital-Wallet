const express = require('express');
const router = express.Router();
const walletModel = require('../models/wallet');
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const emailService = require('../utils/mockEmail');
const fraudDetection = require('../utils/fraudDetection'); 
const fraudRoute = require('./fraudRoute'); // Import the fraud detection function
const auth = require('../middleware/auth');
router.post('/credit', auth, async (req, res) => {
    const { amount, currency } = req.body;
    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid amount entered" });
    }
    let wallet = await walletModel.findOne({ userId: req.user.id });
    if (!wallet) {
        try {
            wallet = await walletModel.create({
                userId: req.user.id,
                balance: amount,
                transactions: [{ type: 'credit', amount, currency: req.body.currency || 'INR' }],
            });
            return res.status(201).json({ message: "Wallet created successfully", wallet });
        } catch (err) {
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }

    }
    wallet.balance += amount;
    wallet.transactions.push({
        type: 'credit',
        amount: amount,
        currency: req.body.currency || 'INR',
        date: new Date(),
        flag: false
    });

    const suspicious = fraudDetection(wallet.transactions);
    if (suspicious.length > 0) {
        wallet.markModified('transactions');
        emailService("admin@gmail.com", `Suspicious transactions detected for user ${req.user.id}. Please review:\n${JSON.stringify(suspicious, null, 2)}`);
        await wallet.save();
    }
    res.status(200).json({ message: "Amount credited successfully", wallet });


})
router.post('/debit', auth, async (req, res) => {
    const { amount, currency } = req.body;
    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid amount entered" });
    }
    let wallet = await walletModel.findOne({ userId: req.user.id });
    if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }
    wallet.balance -= amount;
    wallet.transactions.push({
        type: 'debit',
        amount: amount,
        currency: req.body.currency || 'INR',
        date: new Date(),
        flag: false
    });

    const suspicious = fraudDetection(wallet.transactions);
    if (suspicious.length > 0) {
        wallet.markModified('transactions');
        emailService("admin@gmail.com", `Suspicious transactions detected for user ${req.user.id}. Please review:\n${JSON.stringify(suspicious, null, 2)}`);
    }
    await wallet.save();
    res.status(200).json({ message: "Amount debited successfully", wallet });
})
router.post('/transfer', auth, async (req, res) => {
    const { amount, toUserId, currency = "INR" } = req.body;
    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid amount entered" });
    }
    let wallet = await walletModel.findOne({ userId: req.user.id })
    if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }
    let receiverUser = await userModel.findById(toUserId);
    if (!receiverUser) {
        return res.status(404).json({ message: "Receiver user not found" });
    }
    let receiverWallet = await walletModel.findOne({ userId: toUserId });
    if (!receiverWallet) {
        try {

            receiverWallet = await walletModel.create({
                userId: toUserId,
                balance: 0,
                transactions: []
            })

        } catch (err) {
            return res.status(500).json({ message: "Error while creating receiver wallet" });
        }
    }
    wallet.balance -= amount;
    receiverWallet.balance += amount;
    wallet.transactions.push({
        type: 'transfer',
        amount: amount,
        currency: currency,
        toUser: toUserId,
        date: new Date(),
        flag: false
    });

    const suspiciousSender = fraudDetection(wallet.transactions);
    if (suspiciousSender.length > 0) {
        wallet.markModified('transactions');
        emailService("admin@gmail.com", `Suspicious transactions detected for user ${req.user.id}. Please review:\n${JSON.stringify(suspiciousSender, null, 2)}`);
    }

    receiverWallet.transactions.push({
        type: 'credit',
        amount: amount,
        currency: currency,
        toUser: req.user.id,
        date: new Date(),
        flag: false
    });

    await wallet.save();
    await receiverWallet.save();
    res.status(200).json({ message: "Amount transferred successfully", wallet, receiverWallet });
})

module.exports = router;
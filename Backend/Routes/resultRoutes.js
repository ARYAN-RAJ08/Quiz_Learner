const express = require('express');
const router = express.Router();
const Result = require('../Modal/resultModal');
const User = require('../Modal/mongoModal');
const jwt = require('jsonwebtoken');

const secretCode = "dadsfS@#@$#$#@$1351425431";

// Middleware to authenticate and attach user to req
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretCode, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ message: 'User not found' });
        next();
    });
}

// Middleware to check admin role
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
}

// POST /results - Student submits result
router.post('/results', authenticate, async (req, res) => {
    try {
        const { testName, score, total } = req.body;
        if (!testName || score == null || total == null) {
            return res.status(400).json({ message: 'All fields required' });
        }
        const result = new Result({
            user: req.user._id,
            testName,
            score,
            total
        });
        await result.save();
        res.status(201).json({ message: 'Result saved', result });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /results/me - Student views own results
router.get('/results/me', authenticate, async (req, res) => {
    try {
        const results = await Result.find({ user: req.user._id });
        res.json({ results });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /results - Admin views all results
router.get('/results', authenticate, requireAdmin, async (req, res) => {
    try {
        const results = await Result.find().populate('user', 'fullName email');
        res.json({ results });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router; 
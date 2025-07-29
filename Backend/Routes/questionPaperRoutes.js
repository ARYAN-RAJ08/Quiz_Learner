const express = require('express');
const router = express.Router();
const questionPaperSchema = require('../Modal/questionPaperModal.js');
const userSchema = require('../Modal/mongoModal.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretCode = process.env.JWT_SECRET || "dadsfS@#@$#$#@$1351425431";

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ status: false, message: "Access token required" });
        }

        const decoded = jwt.verify(token, secretCode);
        const user = await userSchema.findById(decoded.id);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ status: false, message: "Admin access required" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ status: false, message: "Invalid token" });
    }
};

// Create new question paper
router.post('/question-paper', authenticateAdmin, async (req, res) => {
    try {
        const { class: className, subject, questions, schedule } = req.body;
        
        // Validation
        if (!className || !subject || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Class, subject, and questions array are required" 
            });
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
                return res.status(400).json({ 
                    status: false, 
                    message: `Question ${i + 1}: Must have question text and exactly 4 options` 
                });
            }
            if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                return res.status(400).json({ 
                    status: false, 
                    message: `Question ${i + 1}: Correct answer must be 0-3` 
                });
            }
        }

        // Check for duplicate paper
        const existingPaper = await questionPaperSchema.findOne({
            class: className,
            subject: subject,
            'schedule.date': schedule?.date
        });

        if (existingPaper) {
            return res.status(409).json({ 
                status: false, 
                message: "A question paper already exists for this class, subject, and date" 
            });
        }

        const newPaper = new questionPaperSchema({
            class: className,
            subject: subject,
            questions: questions,
            schedule: schedule || { frequency: 'once', date: new Date() },
            createdBy: req.user._id
        });

        await newPaper.save();

        res.status(201).json({
            status: true,
            message: "Question paper created successfully",
            paperId: newPaper._id
        });

    } catch (error) {
        console.error('Error creating question paper:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

// Get all question papers (with filtering)
router.get('/question-papers', authenticateAdmin, async (req, res) => {
    try {
        const { class: className, subject, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        if (className) filter.class = className;
        if (subject) filter.subject = subject;

        const skip = (page - 1) * limit;
        
        const papers = await questionPaperSchema
            .find(filter)
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await questionPaperSchema.countDocuments(filter);

        res.json({
            status: true,
            papers: papers,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalPapers: total
            }
        });

    } catch (error) {
        console.error('Error fetching question papers:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

// Get specific question paper
router.get('/question-paper/:id', authenticateAdmin, async (req, res) => {
    try {
        const paper = await questionPaperSchema
            .findById(req.params.id)
            .populate('createdBy', 'fullName email');

        if (!paper) {
            return res.status(404).json({ 
                status: false, 
                message: "Question paper not found" 
            });
        }

        res.json({
            status: true,
            paper: paper
        });

    } catch (error) {
        console.error('Error fetching question paper:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

// Update question paper
router.put('/question-paper/:id', authenticateAdmin, async (req, res) => {
    try {
        const { class: className, subject, questions, schedule } = req.body;
        
        // Validation
        if (!className || !subject || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Class, subject, and questions array are required" 
            });
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
                return res.status(400).json({ 
                    status: false, 
                    message: `Question ${i + 1}: Must have question text and exactly 4 options` 
                });
            }
            if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                return res.status(400).json({ 
                    status: false, 
                    message: `Question ${i + 1}: Correct answer must be 0-3` 
                });
            }
        }

        const updatedPaper = await questionPaperSchema.findByIdAndUpdate(
            req.params.id,
            {
                class: className,
                subject: subject,
                questions: questions,
                schedule: schedule,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedPaper) {
            return res.status(404).json({ 
                status: false, 
                message: "Question paper not found" 
            });
        }

        res.json({
            status: true,
            message: "Question paper updated successfully",
            paper: updatedPaper
        });

    } catch (error) {
        console.error('Error updating question paper:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

// Delete question paper
router.delete('/question-paper/:id', authenticateAdmin, async (req, res) => {
    try {
        const deletedPaper = await questionPaperSchema.findByIdAndDelete(req.params.id);

        if (!deletedPaper) {
            return res.status(404).json({ 
                status: false, 
                message: "Question paper not found" 
            });
        }

        res.json({
            status: true,
            message: "Question paper deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting question paper:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

// Bulk operations
router.post('/question-papers/bulk-delete', authenticateAdmin, async (req, res) => {
    try {
        const { paperIds } = req.body;
        
        if (!paperIds || !Array.isArray(paperIds) || paperIds.length === 0) {
            return res.status(400).json({ 
                status: false, 
                message: "Paper IDs array is required" 
            });
        }

        const result = await questionPaperSchema.deleteMany({
            _id: { $in: paperIds }
        });

        res.json({
            status: true,
            message: `${result.deletedCount} question papers deleted successfully`
        });

    } catch (error) {
        console.error('Error bulk deleting question papers:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

// Get statistics
router.get('/question-papers/stats', authenticateAdmin, async (req, res) => {
    try {
        const stats = await questionPaperSchema.aggregate([
            {
                $group: {
                    _id: null,
                    totalPapers: { $sum: 1 },
                    totalQuestions: { $sum: { $size: "$questions" } },
                    avgQuestionsPerPaper: { $avg: { $size: "$questions" } }
                }
            }
        ]);

        const classStats = await questionPaperSchema.aggregate([
            {
                $group: {
                    _id: "$class",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const subjectStats = await questionPaperSchema.aggregate([
            {
                $group: {
                    _id: "$subject",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            status: true,
            stats: stats[0] || { totalPapers: 0, totalQuestions: 0, avgQuestionsPerPaper: 0 },
            classStats: classStats,
            subjectStats: subjectStats
        });

    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ 
            status: false, 
            message: "Internal server error" 
        });
    }
});

module.exports = router; 
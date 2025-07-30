const express = require('express')
const router = express.Router()
const userSchema = require('../Modal/mongoModal.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // For generating tokens
const nodemailer = require('nodemailer'); // For sending emails
require('dotenv').config(); // Add at the top to use environment variables

const secretCode = process.env.JWT_SECRET || "dadsfS@#@$#$#@$1351425431"; // Use env var
const ADMIN_CODE = process.env.ADMIN_CODE || 'SECRET_ADMIN_CODE'; // Use env var

router.post('/', async (req, res) => {
    res.json("Server Running")
})

//------------------------------Signup or Register--------------------------------------

router.post('/signup', async (req, res) => {
    try {
        // Validate required fields
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }


        // Check for existing user using findOne instead of find
        const existingUser = await userSchema.findOne({ email });


        if (existingUser) {
            return res.status(409).json({ status: false, message: "User with this email id already exists" });
        }

        // Hash password securely using bcrypt
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);


        // Create and save new user using newUser.save(), no email verification
        const newUser = new userSchema({
            fullName,
            email,
            password: hashPassword,
            role: role
        });

        await newUser.save();


        return res.status(201).json({ status: true, message: "Registration successful! You can now log in." });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
});

//---------------------------------------Log In-----------------------------------------

router.post('/login', async (req, res) => {
    try {
        // Validate required fields
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        // Find user by email
        const user = await userSchema.findOne({ email });

        // Check user existence and password validity
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ status: false, message: "Password is incorrect" })
            }
        } else {
            return res.status(401).json({ status: false, message: "User does not exist" })
        }

        // Update lastLogin and log activity
        user.lastLogin = new Date();
        user.activityLog.push({ action: 'login' });
        await user.save();

        // Generate JWT token with appropriate claims (including role)
        const token = jwt.sign({ id: user._id, fullName: user.fullName, email: user.email, role: user.role }, secretCode, { expiresIn: '1h' }); // Fix expiry

        // Send successful login response (include role)
        return res.status(200).json({ status: true, message: "Login Successful!", token, role: user.role });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
});

//---------------------- Role-based Middleware ----------------------

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ status: false, message: 'No token provided' });
    jwt.verify(token, secretCode, (err, user) => {
        if (err) return res.status(403).json({ status: false, message: 'Invalid token' });
        req.user = user;
        next();
    });
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: false, message: 'Access denied: insufficient role' });
        }
        next();
    };
}

//---------------------- Example Protected Routes ----------------------

router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ status: true, message: 'Welcome, admin!', user: req.user });
});

router.get('/student-only', authenticateToken, authorizeRoles('student'), (req, res) => {
    res.json({ status: true, message: 'Welcome, student!', user: req.user });
});

//---------------------- Admin Routes ----------------------

// Get all users (admin only)
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await userSchema.find({ isActive: true }, '-password'); // Exclude password and only active users
        res.json({ status: true, users });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching users' });
    }
});

// Delete a user by ID (admin only)
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await userSchema.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        await userSchema.findByIdAndUpdate(req.user.id, { $push: { activityLog: { action: 'admin-delete-user' } } });
        res.json({ status: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error deleting user' });
    }
});

// Soft delete (deactivate) user instead of hard delete
router.patch('/users/:id/deactivate', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await userSchema.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        await userSchema.findByIdAndUpdate(req.user.id, { $push: { activityLog: { action: 'admin-deactivate-user' } } });
        res.json({ status: true, message: 'User deactivated', user });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error deactivating user' });
    }
});
// Reactivate user (admin only)
router.patch('/users/:id/activate', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await userSchema.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        await userSchema.findByIdAndUpdate(req.user.id, { $push: { activityLog: { action: 'admin-activate-user' } } });
        res.json({ status: true, message: 'User activated', user });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error activating user' });
    }
});

// Promote a student to admin (admin only)
router.patch('/users/:id/promote', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await userSchema.findByIdAndUpdate(
            req.params.id,
            { role: 'admin' },
            { new: true }
        );
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        await userSchema.findByIdAndUpdate(req.user.id, { $push: { activityLog: { action: 'admin-promote-user' } } });
        res.json({ status: true, message: 'User promoted to admin', user });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error promoting user' });
    }
});

//---------------------- User Search & Filtering (Admin) ----------------------

// Search users by name, email, or role (admin only)
router.get('/users/search', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, email, role } = req.query;
        const query = {};
        if (name) query.fullName = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };
        if (role) query.role = role;
        const users = await userSchema.find(query, '-password');
        res.json({ status: true, users });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error searching users' });
    }
});

//---------------------- Activity Log Retrieval ----------------------

// Admin: Get activity log for any user
router.get('/users/:id/activity-log', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id, 'fullName email activityLog');
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        res.json({ status: true, activityLog: user.activityLog, user: { fullName: user.fullName, email: user.email } });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching activity log' });
    }
});

// Student: Get own activity log
router.get('/me/activity-log', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
        const user = await userSchema.findById(req.user.id, 'activityLog');
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        res.json({ status: true, activityLog: user.activityLog });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching activity log' });
    }
});

//---------------------- Student Routes ----------------------

// Get own profile (student only)
router.get('/me', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
        const user = await userSchema.findById(req.user.id, '-password');
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        return res.json({ status: true, user });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching profile' });
    }
});

// Update own profile (student only)
router.put('/me', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
        const updates = {};
        if (req.body.fullName) updates.fullName = req.body.fullName;
        if (req.body.pNumber) updates.pNumber = req.body.pNumber;
        // Do not allow role or password update here
        const user = await userSchema.findByIdAndUpdate(req.user.id, updates, { new: true, select: '-password' });
        if (user) {
            await userSchema.findByIdAndUpdate(req.user.id, { $push: { activityLog: { action: 'update-profile' } } });
        }
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        res.json({ status: true, message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error updating profile' });
    }
});

//---------------------- Password Management ----------------------

const SALT_ROUNDS = 10;

// Change own password (student or admin)
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ status: false, message: 'Old and new password required' });
        }
        const user = await userSchema.findById(req.user.id);
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ status: false, message: 'Old password incorrect' });
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS); // Use SALT_ROUNDS
        user.activityLog.push({ action: 'change-password' });
        await user.save();
        res.json({ status: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error changing password' });
    }
});

// Admin reset user password
router.post('/users/:id/reset-password', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) return res.status(400).json({ status: false, message: 'New password required' });
        const user = await userSchema.findById(req.params.id);
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS); // Use SALT_ROUNDS
        user.activityLog.push({ action: 'admin-reset-password' });
        await user.save();
        res.json({ status: true, message: 'User password reset successfully' });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error resetting password' });
    }
});

// Forgot Password - Send Reset Email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: false, message: 'Email is required' });
        const user = await userSchema.findOne({ email });
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        // Save token and expiry to user
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        // Send email
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset for your Learner account.</p>
                   <p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`
        };
        await transporter.sendMail(mailOptions);
        res.json({ status: true, message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Error sending reset email' });
    }
});

// Reset Password - Set New Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ status: false, message: 'Token and new password required' });
        const user = await userSchema.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ status: false, message: 'Invalid or expired token' });
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.activityLog.push({ action: 'reset-password' });
        await user.save();
        res.json({ status: true, message: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Error resetting password' });
    }
});

//------------------------------------Profile-------------------------------------------

// Multer config for profile picture uploads
const fs = require('fs'); // Add fs for directory check

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, req.user.id + '-' + Date.now() + ext);
    }
});
// File filter for images only
function fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}
const upload = multer({ storage, fileFilter });

// Student: Upload own profile picture
router.post('/me/profile-pic', authenticateToken, authorizeRoles('student'), upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ status: false, message: 'No file uploaded' });
        let user = await userSchema.findByIdAndUpdate(req.user.id, { profilePic: '/uploads/' + req.file.filename }, { new: true, select: '-password activityLog' });
        if (!user.activityLog) user.activityLog = [];
        user.activityLog.push({ action: 'upload-profile-pic' });
        await user.save();
        res.json({ status: true, message: 'Profile picture updated', profilePic: user.profilePic });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error uploading profile picture' });
    }
});

// Admin: Upload profile picture for any user
router.post('/users/:id/profile-pic', authenticateToken, authorizeRoles('admin'), upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ status: false, message: 'No file uploaded' });
        let user = await userSchema.findByIdAndUpdate(req.params.id, { profilePic: '/uploads/' + req.file.filename }, { new: true, select: '-password activityLog' });
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });
        await userSchema.findByIdAndUpdate(req.user.id, { $push: { activityLog: { action: 'admin-upload-profile-pic' } } });
        res.json({ status: true, message: 'Profile picture updated', profilePic: user.profilePic });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error uploading profile picture' });
    }
});

// Admin: Get dashboard stats
router.get('/admin/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const [total, active, inactive, admins, students, recentLogins] = await Promise.all([
            userSchema.countDocuments(),
            userSchema.countDocuments({ isActive: true }),
            userSchema.countDocuments({ isActive: false }),
            userSchema.countDocuments({ role: 'admin' }),
            userSchema.countDocuments({ role: 'student' }),
            userSchema.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
        ]);
        res.json({ status: true, stats: { total, active, inactive, admins, students, recentLogins } });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error fetching stats' });
    }
});

router.get('/admin/users', async (req, res) => {
    try {
        // const token = req.headers?.authorization?.split(" ")[1]



        const users = await userSchema.find()


        return res.status(200).json({ status: true, data: users })


    } catch (err) {
        return res.status(500).json({ status: false, message: "User not found" })
    }
})

router.post("/user-detail", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: false, message: "Email is required" });
        }

        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        return res.status(200).json({ status: true, user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
})

//------------------------------------Exporting-----------------------------------------

module.exports = router;
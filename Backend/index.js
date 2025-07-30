const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const userRoutes = require('./Routes/userRoutes.js')
const resultRoutes = require('./Routes/resultRoutes');
const questionPaperRoutes = require('./Routes/questionPaperRoutes.js');
// const adminRoutes = require('./Routes/adminRoutes.js'); // ✅ NEW

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.use(cors({
    origin: true,
    credentials: true
}))

app.use('/', userRoutes)
app.use('/', resultRoutes)
app.use('/', questionPaperRoutes)
// app.use('/', adminRoutes) // ✅ NEW

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

(async () => {
    try {
        const c = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected to ${c.connection.host}`);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
})();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

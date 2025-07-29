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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose.connect('mongodb://localhost:27017/QuizApp')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log("Failed to connect to Database", err))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

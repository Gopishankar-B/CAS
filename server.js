const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Add this line to import User model
const Student = require('./models/Student'); // Add this line to import Student model

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS and JavaScript)
app.use(express.static('public'));

// Handle student form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, age, credentials, cgpa } = req.body;
        const student = new Student({ name, age, credentials, cgpa });
        await student.save();
        res.status(201).send('Student record saved successfully.');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Handle user signup
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/login.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Handle user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        res.redirect('/index.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

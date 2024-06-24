const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Define a schema and model for Student
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    credentials: String,
    cgpa: Number
});

const Student = mongoose.model('Student', studentSchema);

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS and JavaScript)
app.use(express.static('public'));

// Handle form submission
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

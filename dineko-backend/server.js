const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import CORS package
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like HTML, CSS, JS from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'dineko_user',
    password: 'user_password',
    database: 'dineko'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to database');
    }
});

// Serve the signup page (for a simple HTML form)
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle the form submission (signup logic)
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validation check
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if email already exists
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).send('Internal server error');
            }

            if (results.length > 0) {
                return res.status(400).send('Email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user to database
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(query, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error saving user:', err);
                    return res.status(500).send('Internal server error');
                }

                // Redirect to login page after successful signup
                res.redirect('/login');
            });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Internal server error');
    }
});

// Serve the login page (for simplicity, using a static HTML file)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

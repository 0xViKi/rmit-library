const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');
const session = require('express-session');
const app = express();
const port = 3000;
localIP = '192.168.50.95'

const userDB = '../db/users.db';
const bookDB = '../db/newbooks.db';

// Define the schema for the users table
const createUsersTableSql = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
)
`;

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
        user: "MAILGUN@EMAILID",
        pass: "MAILGUN@PASSWORD"
    }
});

// Store generated OTPs in memory (not recommended for production)
const otpMap = {};

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

app.use(bodyParser.json());

app.use(cors({
    origin: `https://${localIP}/`,
    credentials: true,
}));

app.use(session({
    secret: 'SuP3rL0nGS3cr3tM4g!cK3Y', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
}));

const adminUser = {
    username: 'Admin',
    email: 'admin@admin.com',
    password: 'Admin@123',
    role: 'admin',
  };
  
  

// Check if the User database file exists
if (!fs.existsSync(userDB)) {
    console.log('Database file not found. Creating a new database...');

    // Create a new database file
    const db = new sqlite3.Database(userDB, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the User database.');

            // Create the users table
            db.run(createUsersTableSql, (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table created successfully.');
                }
            });
        }
    });
    bcrypt.hash(adminUser.password, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err.message);
        } else {
          db.run(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [adminUser.username, adminUser.email, hash, adminUser.role],
            (err) => {
              if (err) {
                console.error('Error inserting admin user:', err.message);
              } else {
                console.log('Admin user created successfully.');
              }
              // Close the database connection when done
                db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Disconnected from the User database.');
                }
            });
            }
          );
        }
      });
    
} else {
    console.log('Database file already exists. Skipping schema creation.');
}

const db = new sqlite3.Database(userDB, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        
        console.log('Connected to the User database.');
    }
});

const roleForNewUsers = 'user'
// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const insertUserSql = `
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `;
        db.run(insertUserSql, [username, email, hashedPassword, roleForNewUsers], (err) => {
            if (err) {
                console.error('Error registering user:', err.message);
                res.status(500).send('Internal server error');
            } else {
                console.log('User registered successfully.');
                res.status(201).send('User registered successfully.');
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error.message);
        res.status(500).send('Internal server error');
    }
});

// Check if email already exists
app.post('/api/check-email', (req, res) => {
    const { email } = req.body;
    const selectUserSql = 'SELECT * FROM users WHERE email = ?';

    db.get(selectUserSql, [email], (err, row) => {
        if (err) {
            console.error('Error checking email:', err.message);
            res.status(500).send('Internal server error');
        } else {
            res.json({ exists: !!row });
        }
    });
});

// Check if username already exists
app.post('/api/check-username', (req, res) => {
    const { username } = req.body;
    const selectUserSql = 'SELECT * FROM users WHERE username = ?';

    db.get(selectUserSql, [username], (err, row) => {
        if (err) {
            console.error('Error checking username:', err.message);
            res.status(500).send('Internal server error');
        } else {
            res.json({ exists: !!row });
        }
    });
});
// User login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    try {
        // Fetch user from database by username
        const selectUserSql = 'SELECT * FROM users WHERE username = ?';
        db.get(selectUserSql, [username], (err, row) => {
            if (err) {
                console.error('Error retrieving user:', err.message);
                res.status(500).send('Internal server error');
            } else if (!row) {
                console.log('User not found:', username);
                res.status(401).send('Invalid username or password');
            } else {
                // Check password
                bcrypt.compare(password, row.password_hash, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparing password:', err.message);
                        res.status(500).send('Internal server error');
                    } else if (isMatch) {
                        // Set session
                        req.session.userId = row.id;
                        console.log('Login successful:', username);
                        if (row.role === 'admin') {
                            res.status(200).send({ message: 'Login successful', dashboard: 'admin' });
                        } else {
                            res.status(200).send({ message: 'Login successful', dashboard: 'user' });
                        }
                    } else {
                        console.log('Invalid password for user:', username);
                        res.status(401).send({ message: 'Invalid password' });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal server error');
    }
});


// Endpoint for logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Send OTP
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in memory (not recommended for production)
    otpMap[email] = otp;

    // Send email with OTP
    const mailOptions = {
        from: 'library.passwordreset@sandbox73c8004fc1cb4b8787139d43e2b72a83.mailgun.org',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('An error occurred. Please try again later.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('OTP sent to your email.');
        }
    });
});

// Endpoint for verifying OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    // Check if OTP exists in memory (not recommended for production)
    if (otpMap[email] && otpMap[email] == otp) {
        res.status(200).send('OTP verification successful.');
    } else {
        res.status(400).send('Invalid OTP.');
    }
});

// Endpoint for resetting password
app.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        const updatePasswordSql = 'UPDATE users SET password_hash = ? WHERE email = ?';
        db.run(updatePasswordSql, [hashedPassword, email], (err) => {
            if (err) {
                console.error('Error resetting password:', err.message);
                res.status(500).send('Internal server error');
            } else {
                console.log('Password reset successful');
                res.status(200).send('Password reset successful');
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).send('Internal server error');
    }
});

// conencting to Books database
const bdb = new sqlite3.Database(bookDB, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the library database.');
    }
})

// Route to get all books
app.get('/api/books', (req, res) => {
    bdb.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to search books by name or author
app.get('/api/books/search', (req, res) => {
    const query = req.query.q;
    bdb.all(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?',
      [`%${query}%`, `%${query}%`],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      }
    );
  });

  app.post('/api/book/not-visible', (req, res) => {
    const { bookId } = req.body;
    const updateHiddenSql = 'UPDATE books SET visible = 0 WHERE id = ?';
    bdb.run(updateHiddenSql, [bookId], function(err) {
        if (err) {
            console.error('Error enabling visiblity status:', err.message);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).send({ message: 'Book disabled for Users' });
        }
    });
});

app.post('/api/book/visible', (req, res) => {
    const { bookId } = req.body;
    const updateHiddenSql = 'UPDATE books SET visible = 1 WHERE id = ?';
    bdb.run(updateHiddenSql, [bookId], function(err) {
        if (err) {
            console.error('Error disabling visiblity status:', err.message);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).send({ message: 'Book enabled for Users' });
        }
    });
});


const server = app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


// Close the database connection when the server is shut down
server.on('close', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Disconnected from the library database.');
        }
    });
});

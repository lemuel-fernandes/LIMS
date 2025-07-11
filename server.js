const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory user database (you can replace this with a JSON file if needed)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'lab-incharge' },
  { id: 2, username: 'manager', password: 'manager123', role: 'lab-incharge' },
  { id: 3, username: 'instructor', password: 'instructor123', role: 'lab-instructor' },
  { id: 4, username: 'teacher', password: 'teacher123', role: 'lab-instructor' }
];

// Alternative: JSON file-based storage
// const usersFile = './users.json';
// 
// function loadUsers() {
//   if (fs.existsSync(usersFile)) {
//     return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
//   }
//   return users;
// }
// 
// function saveUsers(userData) {
//   fs.writeFileSync(usersFile, JSON.stringify(userData, null, 2));
// }

app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  
  // Find user with matching credentials
  const user = users.find(u => 
    u.username === username && 
    u.password === password && 
    u.role === role
  );
  console.log(req.body, user)
  if (user) {
    res.json({ 
      success: true, 
      role: user.role, 
      username: user.username 
    });
  } else {
    res.json({ 
      success: false, 
      message: 'Invalid credentials. Please check your username, password, and role.' 
    });
  }
});

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all users (for testing purposes)
app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role })));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available demo accounts:');
  console.log('Lab InCharge: admin/admin123, manager/manager123');
  console.log('Lab Instructor: instructor/instructor123, teacher/teacher123');
});
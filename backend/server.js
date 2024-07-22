const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // Import bcryptjs

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todoApp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [{ text: String, isCompleted: Boolean }]
});

const User = mongoose.model('User', userSchema);

// Define routes for users and tasks
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword, tasks: [] });
  await newUser.save();
  res.json({ message: 'Registration successful' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Compare the password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  res.json({ username });
});

app.get('/tasks', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  res.json(user.tasks);
});

app.post('/tasks', async (req, res) => {
  const { username, text } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  user.tasks.push({ text, isCompleted: false });
  await user.save();
  res.json(user.tasks);
});

app.put('/tasks/:index', async (req, res) => {
  const { username, text, isCompleted } = req.body;
  const { index } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  if (index < 0 || index >= user.tasks.length) {
    return res.status(400).json({ message: 'Task index out of bounds' });
  }
  user.tasks[index] = { text, isCompleted };
  await user.save();
  res.json(user.tasks);
});

app.delete('/tasks/:index', async (req, res) => {
  const { username } = req.body;
  const { index } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  user.tasks.splice(index, 1);
  await user.save();
  res.json(user.tasks);
});

app.delete('/tasks', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  user.tasks = [];
  await user.save();
  res.json(user.tasks);
});

app.listen(port, () => console.log(`Server running on port ${port}`));

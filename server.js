const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI
// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    return res.send('hello world!');
});


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Uses port 80 on deployed server or port 5000 locally
const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
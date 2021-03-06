const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path')

// Import routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// body-parser setup
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// DB Config
const db = require('./config/keys').mongoURI
// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Passport initialization
app.use(passport.initialize());
// Passport configuration
require('./config/passport')(passport);


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

// Uses port 80 on deployed server or port 5000 locally
const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
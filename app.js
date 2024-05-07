const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const nocache = require('nocache');

//route setting
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');

const app = express();

// Setting port
const port = process.env.PORT || 3003;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(nocache());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

//one day in seconds
const oneDay = 1000 * 60 * 60 * 24;

//session
app.use(session({
    secret: uuidv4(),
    resave: false,
    cookie: { maxAge: oneDay },
    saveUninitialized: true,
})
);

// Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    if (req.session.username) {
        res.redirect('/user/home')
    } else {
        res.render('login', { title: 'Login Page', status: false });
    }
});

//listen port
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
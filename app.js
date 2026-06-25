require("dotenv").config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo').MongoStore;

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");
const { connectToDatabase } = require("./config/mongoose-connection");

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let sessionStore;
const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URI;

if (mongoUrl && MongoStore && typeof MongoStore.create === 'function') {
    sessionStore = MongoStore.create({
        mongoUrl,
        ttl: 14 * 24 * 60 * 60,
    });
} else {
    console.warn('Warning: Mongo session store unavailable. Using memory store (not suitable for production).');
    sessionStore = null;
}

const isProduction = process.env.NODE_ENV === 'production';

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET || "fallbackSecretKey",
        cookie: {
            secure: isProduction,
            sameSite: isProduction ? 'lax' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        },
        ...(sessionStore && { store: sessionStore }),
    })
);

app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(async function (req, res, next) {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('Database unavailable:', err.message);
        res.status(503).send('Service temporarily unavailable. Please try again in a moment.');
    }
});

app.use('/', indexRouter);
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, function () {
        console.log("Server is running on port 3000");
    });
}

module.exports = app;

require("dotenv").config(); // Sabse upar hona chahiye

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo'); // Import bilkul clean hai

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");
const db = require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// 🔥 BULLETPROOF STORAGE CHECK: Jo sahi chalega, wahi options select honge
let sessionStore;
if (MongoStore && typeof MongoStore.create === 'function') {
    // Agar modern v4/v5 version chal raha hai
    sessionStore = MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60
    });
} else if (typeof MongoStore === 'function') {
    // Agar purana v3 version fallback chal raha hai
    sessionStore = new MongoStore({
        mongooseConnection: db,
        ttl: 14 * 24 * 60 * 60
    });
} else {
    // Agar dono fail ho jayein (taaki app crash na ho)
    console.log("Warning: MongoStore configuration bypassed to prevent crash.");
    sessionStore = null;
}

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET || "fallbackSecretKey",
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Local par HTTP support karega, Vercel par HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        },
        ...(sessionStore && { store: sessionStore }) // Sirf tab attach hoga agar storage engine safe ho
    })
);

app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter); 
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

module.exports = app;
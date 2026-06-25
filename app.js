const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');

// ➔ .env ko sabse pehle load karein taaki baaki files ko env variables mil sakein
require("dotenv").config();
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

const db = require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret : process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter); 

app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Local machine ke liye listen chalega, par Vercel isko bypass kar sakta hai
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

// 👈 YEH SABSE CRITICAL HAI: Vercel serverless function ke liye app export hona zaroori hai
module.exports = app;
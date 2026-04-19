const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config({ quiet: true });

const connectDB = require('./config/mongoose-connection');

const orderRouter = require('./routes/orderRouter');
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const indexRouter = require('./routes/index');

const Port = process.env.PORT || 3000;

 
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}
 
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
app.set('trust proxy', 1);
 
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

 
app.use(flash());

 
app.use(express.static(path.join(__dirname, 'public')));

 
app.set('view engine', 'ejs');

 
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Try again after 15 minutes."
});

const forgotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many reset requests. Try later."
});

 
app.use('/users/login', loginLimiter);
app.use('/users/forgot-password', forgotLimiter);

 
app.use('/', indexRouter);
app.use('/', orderRouter);
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

 
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something went wrong");
});

 
async function startServer() {
    try {
        await connectDB();

        app.listen(Port, () => {
            console.log(`Server is live on port ${Port}`);
        });

    } catch (error) {
        console.log("Failed to start server");
    }
}

startServer();

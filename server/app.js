//import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_CALLBACK_URL} from "./constants";
const {STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_CALLBACK_URL} = require('./constants')
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var passport = require("passport");
var StravaStrategy = require('passport-strava-oauth2').Strategy;

var monk = require('monk');
var db = monk('127.0.0.1:27017/impel');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
    req.db = db;
    next();
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: STRAVA_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      
      console.log(profile);
      return done(null, profile);
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

/**
 * -----------------------------------------------------------------------------
 * Cross Origin Requests
 * -----------------------------------------------------------------------------
 */
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * -----------------------------------------------------------------------------
 * Routes
 * -----------------------------------------------------------------------------
 */
app.use('/', indexRouter);
app.use('/user', userRouter);

app.get('/auth/strava',
  passport.authenticate('strava'));

app.get('/auth/strava/callback', 
  passport.authenticate('strava', { failureRedirect: 'http://127.0.0.1:5600/auth/notfound' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("TRYING TO REDIRECT")
    res.redirect('http://127.0.0.1:5600/strava');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

var express = require("express");
var app = express();
var bodyParser= require("body-parser");

var mongoose = require("mongoose");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
var seedDB = require("./seeds");

var passport = require("passport");

var LocalStrategy = require("passport-local");

var User = require("./models/user");


var commentRoutes = require("./routes/comment"),
     campgroundRoutes = require("./routes/campgrounds"),
     indexRoutes = require("./routes/index");
//seedDB();




var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
//mongoose.connect(url, {useNewUrlParser: true});

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://alex2425:alex24252425@yelpcampcluster-01mgz.mongodb.net/yelp_camp?retryWrites=true&w=majority", { useNewUrlParser: true });










app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(flash());
// ==========PASSPORT CONFIG ==============================

app.use(require("express-session")({
    secret: "Secret secret ding dong pong?",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=========================================================

// instead of passing on every route the current user we define it here
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.get("/", function(req, res){
    res.render("landing");
});

    
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`YelpCamp Server started on port: ${ PORT }`);
});
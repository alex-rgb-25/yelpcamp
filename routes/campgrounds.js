var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

var middleware = require("../middleware/index.js");
//INDEX - displays all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;

    var author = {
        id: req.user._id,
        username: req.user.username
    }


    var newCampground = {name : name, price: price, image: image, description: description, author:author};
    //Create a new campground and save it to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground


// should be before  /campgrounds/:id  so it wont be threated as an id
router.get("/new", middleware.isLoggedIn, function(req, res){
        res.render("campgrounds/new");
});

//SHOW - shows more info about one cmapground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
    //find the campground with provided ID
    //render show template with that campground
})

//edit route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
//is user logged in?

        Campground.findById(req.params.id, function(err, foundCampground){
             res.render("campgrounds/edit",{campground:foundCampground});
        });
});


// update route 

router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    } )

})


//destroy route


router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});



module.exports= router;
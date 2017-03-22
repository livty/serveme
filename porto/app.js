var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose");
var methodOverride = require("method-override");
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));
mongoose.Promise = require('bluebird');


mongoose.connect("mongodb://localhost/web_porto");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


var siteSchema = new mongoose.Schema({
    title: String,
    picture: String,
    image:String,
    row: String,
    body: String,
    text:String,
    more:String,
    created: {type:Date,default:Date.now}
    
});
var Site = mongoose.model("Site", siteSchema);


app.get("/", function(req,res){
    res.redirect("/home");
});
app.get("/home", function(req,res){
    Site.findAsync({}, function(err,sites){
        if(err){
           console.log(err);
        }else{
            res.render("index",{sites: sites});
        }
    });
});
app.get("/work",function(req,res){
    Site.find({}).sort({created:-1}).exec( function(err, sites){
        if(err){
            console.log(err);
        }else{
            res.render("work",{sites: sites});
        }
    });
});
app.get("/puppy", function(req,res){
    res.render("puppy");
});
app.get("/about",function(req,res){
    res.render("about");
});
app.get("/contact",function(req,res){
    res.render("contact");
});
app.post("/puppy",function(req,res){
    res.redirect("puppy");
});
app.post("/work", function(req,res){
    Site.create(req.body.site, function(err, newSite){
        if(err){
            res.render("contact");
        }else{
            res.redirect("/work");
        }
    });
});
app.get("/work/:id/edit", function(req,res){
    Site.findById(req.params.id, function(err, foundSite){
        if(err){
            console.log(err);
        }else{
            res.render("edit", {site: foundSite});
        }
    });
  
});
app.put("/work/:id", function(req,res){
    
 Site.findByIdAndUpdate(req.params.id,req.body.site, function(err, updatedSite){
        if(err){
            console.log(err);
        }else{
            res.redirect("/work");
        }
    });
});






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("To your needs!");
});
// Student app

var express = require("express"),
app = express(),
redis = require("redis"),
client = redis.createClient(),
methodOverride = require("method-override"),
bodyParser = require("body-parser");

// add middle ware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// include static files
app.use(express.static(__dirname + '/public'));

// Routes

// index 
app.get("/", function(req, res) {
  console.log("root route");
  client.LRANGE("studentlist", 0, -1, function(err, students) {
    //console.log(students);
    res.render("index", {students: students});
  });
});

// create, the route should be /students/create
app.post("/create", function(req,res){
  console.log("create route");
  client.LPUSH("studentlist", req.body.studentname);
  res.redirect("/");
});

// update, the route should be /students/:student/edit
app.put("/update/:student", function(req,res){
  console.log("update route");

  // should remove the old and add the new
  // not edit in place

  res.redirect("/");
});

// delete
app.delete("/remove/:student", function(req, res){
  console.log("remove route");
  client.LRANGE("studentlist", 0, -1, function(err,students) {
    students.forEach(function(student){
      if (req.params.student === student) {
        client.LREM("studentlist",1,student);
        res.redirect("/");
      }
    });
  });
});

// delete all
app.delete("/delete/all", function(req, res){
  console.log("delete all route");
  client.DEL("studentlist");
  res.redirect("/");
});

// start server
app.listen(3000, function() {
  console.log("server starting");
});
require('dotenv').config({path:`.env.${process.env.NODE_ENV}`})
const express = require("express")
const path = require("path");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config");


app.use(express.static("public"));
app.set("view engine", "ejs");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const dbConnection = mysql.createConnection(config.dbConfig);

dbConnection.connect((err)=>{
    if(err){
        throw err;
    }

    console.log("Connected to the Database");
});

router.get("/", function (req, res) {
    const query = "SELECT * FROM courses ORDER BY id ASC"

    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err;
        }
        res.render("index", {
           courses: result, 
        });
    });  
});

router.get("/course/:id", function (req, res) {

    const courseId = req.params.id;
    
    const query = `SELECT * FROM courses WHERE id = ${courseId}`;

    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err            
        }
        res.render("course", {
            course: result[0]
        });
    });  
  });

  router.get("/add-course", function (req, res) {

     res.render("add-course");
  });

router.post("/delete-course", function(req,res){
    const query = `DELETE FROM courses WHERE id = ${req.body.id}`;
    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err            
        }
        res.writeHead(302);
        res.end();
        
    });  
});

router.post("/submit-course-added", function(req,res){
    const query = `INSERT INTO courses (name,colour) VALUES ("${req.body.name}" , "${req.body.colour}")`;
    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err            
        }
        res.writeHead(302,{ location: "/" });
        res.end();
        
    });  
});

router.post("/update-course", function(req,res){
    const query = `UPDATE courses SET name ="${req.body.name}", colour="${req.body.colour}" WHERE id = ${req.body.id}`;
    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err            
        }
        res.writeHead(302,{ location: "/" });
        res.end();
        
    });  
});

app.use("/", router);

app.listen(config.serverPort,()=>{
    console.log('Express Server is running at Port');
})
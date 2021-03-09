// add required modules (1)
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

// add app with express framework (2)
var app = express();
// body parsing of app (3)
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors());

// connection build with mysql (4)
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'learners',
    multipleStatements: true
});

// connection connect (5)
conn.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

// port (6)
const port = process.env.port || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

// routing (7)
// var router = require('./routes');
// app.use('/api', router);

// ------------ solution as per your need start here--------------------------------
// ---------------------------------------------------------------------------------
//for select data
app.get('/learners', (req, res) => {
    let sql = 'SELECT * FROM learnerdetails';
    conn.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//for select with a particular id
app.get('/learners/:id', (req, res) => {
    let sql = 'SELECT * FROM learnerdetails WHERE learner_id = ?';
    conn.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//for insert data
app.post('/save', (req, res) => {
    let reqBody = req.body;
    let data = {learner_id: reqBody.learner_id, learner_name: reqBody.learner_name, learner_email:reqBody.learner_email, course_Id:reqBody.course_Id};
    let sql = "INSERT INTO learnerdetails SET ?";
    conn.query(sql, data, (err, rows, fields) => {
        if(err) throw err;
        res.redirect('/learners');
    })
});

// for update data
app.post('/update', (req, res) =>{
    let reqBody = req.body;
    let sql = "UPDATE learnerdetails SET learner_name='"+reqBody.learner_name+"', learner_email='"+reqBody.learner_email+"', course_Id='"+reqBody.course_Id+"' WHERE learner_id='"+reqBody.learner_id+"'";
    conn.query(sql, (err) =>{
        if(err) throw err;
        res.json({
            data: 'Record successfully updated!'
        });
        // res.redirect('/learners');
    });
});

// for delete data
app.post('/delete', (req, res)=>{
    let reqBody = req.body;
    let sql = "DELETE FROM learnerdetails WHERE learner_id='"+reqBody.learner_id+"'";
    conn.query(sql, (err)=>{
        if(err) throw err;
        res.json({
            data: 'Record successfully deleted!'
        });
    })
})
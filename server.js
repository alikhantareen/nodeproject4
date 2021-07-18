const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const db = "mongodb+srv://alikhantareen:Pakistan786@cluster0.iqom8.mongodb.net/exercise?w=majority&retryWrites=true"

//database connection
mongoose.connect(db, {useNewUrlParser: true}, () => {
  console.log("database connected")
})

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded());
const User = require('./modeuls/username.js').User
const Exercise = require('./modeuls/exercise.js').Exercise

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//user register
app.post('/api/users', (req, res) => {
  let name = req.body.username;
  User.findOne({ username : name}, (err,user) => {
    const new_user = new User({username : name})
    if(!user){
      new_user.save(function(err){
        if (err) return console.error(err);
      })
      res.json(new_user)
    }
    else{
      res.json("username already taken")
    }
  })
})

// add exercise data
app.post('/api/users/:_id/exercises', (req, res)=>{
  let id = req.params._id
  let description = req.body.description
  let duration = parseInt(req.body.duration)
  let date = ''
  let username

  User.findById(id, (err,user) => {
    if(!user){
      res.json("not registered")
    }
    else{
      username = user.username

      if (req.body.date){
        date = new Date(req.body.date).toDateString()
      }else{
        date = new Date().toDateString()
      }
      let exercise_data = new Exercise({
        username: username,
        date: date,
        duration: duration,
        description: description
      })
      exercise_data.save(function(err){
        if (err) return console.error(err);
      })
      // exercise_data._id = id
      res.json({
        _id: id,
        username: username,
        date: date,
        duration: duration,
        description: description
      })
      // res.json(exercise_data)
    }
  })

  
})

//users log
app.get('/api/users', (req, res) => {
  User.find(function (err, data) {
    if (err) return console.error(err);
    res.json(data)
  })
  
})

app.get('/api/users/:_id/logs', (req, res)=>{
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  let id = req.params._id
  let log = []
  let username

  User.findById(id, function(err, user){
    if(user){
      username = user.username
      Exercise.find({username: username}, (err,data)=>{
        if(data){
          for(let i=0; i<data.length; i++){
            let obj = {
              description: data[i].description,
              duration: data[i].duration,
              date: data[i].date,
            }  
            log.push(obj)
          }
    
          if (from) {
            from = new Date(from);
            log = log.filter(obj => {
              let date = new Date(obj.date);
              return date >= from;
            })
          }
    
          if (to) {
            to = new Date(to);
            log = log.filter(obj => {
              let date = new Date(obj.date);
              return date <= to;
            })
          }
    
          if (limit) {
            limit = parseInt(limit);
            log = log.slice(0, limit);
          }
    
          res.json({
            _id : id,
            username : username,
            count : log.length,
            log
          })
        }
        
      })
    }
    else {
      res.json('id not found')
    }
  }) 

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
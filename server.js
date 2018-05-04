const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/static"));
app.set('views', (__dirname+"/views"));

app.set('view engine', 'ejs');
const server = app.listen(4500);
const io = require('socket.io')(server);

let players = [];
let current_turn = 0;
let timeOut;
let _turn = 0;
const MAX_WAITING = 10000;
let counter=0;

function next_turn(){
   _turn = current_turn++ % players.length;
   players[_turn].emit('your_turn');
   console.log("next turn triggered " , _turn);
   triggerTimeout();
}

function triggerTimeout(){
  timeOut = setTimeout(()=>{
    next_turn();
  },MAX_WAITING);
}

function resetTimeOut(){
   if(typeof timeOut === 'object'){
     console.log("timeout reset");
     clearTimeout(timeOut);
   }
}
let colors=['red', 'blue', 'green', 'teal', 'yellow', 'tan'];
var col=[];
for(var i=0;i<49;i++){
  col.push(colors[Math.floor(Math.random() * colors.length)]);
  }
    
io.on('connection', function (socket) { //2
  

  socket.on('create_new_gamer',function(){
    if(counter<5)
      {
        players.push(socket);
        socket.emit('board',{colors:col,usercolor:colors[counter],userNumber:counter});
        counter++;
      }
      else 
      console.log("Maxed out connections");
  })
  socket.on('pass_turn',function(){
    if(players[_turn] == socket){
      resetTimeOut();
       next_turn();
    }
  
 })
  socket.emit('greeting', { msg: 'Greetings, from server Node, brought to you by Sockets! -Server' }); //3
  socket.on('thankyou', function (data) { //7
    console.log(data.msg); //8 (note: this log will be on your server's terminal)
  });


  socket.on('clicked',function(data){
    console.log("This was clicked",data.id);

    io.emit('update_color',{id:data.id});
  });
    
});

app.get('/', function(req, res){
  res.render('game');
});